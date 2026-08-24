import { eventBus } from '../utils/eventBus.js';

export function initToasts() {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    let toasts = [];
    
    eventBus.on('toast:show', ({ message, type = 'info', undoAction }) => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        
        toast.innerHTML = `
            <span class="toast__icon">${icon}</span>
            <span class="toast__message">${message}</span>
            ${undoAction ? '<button class="toast__undo">Undo</button>' : ''}
            <button class="toast__close"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            <div class="toast__progress"></div>
        `;
        
        container.appendChild(toast);
        toasts.push(toast);
        
        if (toasts.length > 3) {
            const oldest = toasts.shift();
            removeToast(oldest);
        }
        
        if (undoAction) {
            toast.querySelector('.toast__undo').addEventListener('click', () => {
                undoAction();
                removeToast(toast);
            });
        }
        
        toast.querySelector('.toast__close').addEventListener('click', () => {
            removeToast(toast);
        });
        
        setTimeout(() => {
            removeToast(toast);
        }, 4000);
    });
    
    function removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        toast.classList.add('removing');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
            toasts = toasts.filter(t => t !== toast);
        }, 300);
    }
}
