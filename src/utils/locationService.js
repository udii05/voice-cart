import { storage } from './storage.js';
import { eventBus } from './eventBus.js';
import { CURRENCIES } from '../data/translations.js';

// Predefined Regional Defaults
export const POPULAR_REGIONS = [
    {
        id: 'us',
        country: 'United States',
        countryCode: 'US',
        city: 'New York',
        postalCode: '10001',
        currency: 'USD',
        currencyLocale: 'en-US',
        symbol: '$',
        flag: '🇺🇸',
        displayName: 'New York, USA (10001)'
    },
    {
        id: 'in',
        country: 'India',
        countryCode: 'IN',
        city: 'Bengaluru',
        postalCode: '560001',
        currency: 'INR',
        currencyLocale: 'hi-IN',
        symbol: '₹',
        flag: '🇮🇳',
        displayName: 'Bengaluru, India (560001)'
    },
    {
        id: 'gb',
        country: 'United Kingdom',
        countryCode: 'GB',
        city: 'London',
        postalCode: 'SW1A 1AA',
        currency: 'GBP',
        currencyLocale: 'en-GB',
        symbol: '£',
        flag: '🇬🇧',
        displayName: 'London, UK (SW1A)'
    },
    {
        id: 'eu_de',
        country: 'Germany / Europe',
        countryCode: 'DE',
        city: 'Berlin',
        postalCode: '10115',
        currency: 'EUR',
        currencyLocale: 'de-DE',
        symbol: '€',
        flag: '🇪🇺',
        displayName: 'Berlin, Germany (10115)'
    },
    {
        id: 'fr',
        country: 'France',
        countryCode: 'FR',
        city: 'Paris',
        postalCode: '75001',
        currency: 'EUR',
        currencyLocale: 'fr-FR',
        symbol: '€',
        flag: '🇫🇷',
        displayName: 'Paris, France (75001)'
    },
    {
        id: 'ca',
        country: 'Canada',
        countryCode: 'CA',
        city: 'Toronto',
        postalCode: 'M5V 2T6',
        currency: 'CAD',
        currencyLocale: 'en-CA',
        symbol: 'CA$',
        flag: '🇨🇦',
        displayName: 'Toronto, Canada (M5V)'
    },
    {
        id: 'au',
        country: 'Australia',
        countryCode: 'AU',
        city: 'Sydney',
        postalCode: '2000',
        currency: 'AUD',
        currencyLocale: 'en-AU',
        symbol: 'A$',
        flag: '🇦🇺',
        displayName: 'Sydney, Australia (2000)'
    },
    {
        id: 'jp',
        country: 'Japan',
        countryCode: 'JP',
        city: 'Tokyo',
        postalCode: '100-0001',
        currency: 'JPY',
        currencyLocale: 'ja-JP',
        symbol: '¥',
        flag: '🇯🇵',
        displayName: 'Tokyo, Japan (100-0001)'
    },
    {
        id: 'ae',
        country: 'United Arab Emirates',
        countryCode: 'AE',
        city: 'Dubai',
        postalCode: '00000',
        currency: 'AED',
        currencyLocale: 'ar-AE',
        symbol: 'AED',
        flag: '🇦🇪',
        displayName: 'Dubai, UAE'
    },
    {
        id: 'sg',
        country: 'Singapore',
        countryCode: 'SG',
        city: 'Singapore',
        postalCode: '018989',
        currency: 'SGD',
        currencyLocale: 'en-SG',
        symbol: 'S$',
        flag: '🇸🇬',
        displayName: 'Singapore (018989)'
    }
];

class LocationService {
    constructor() {
        this.currentLocation = storage.get('voice_cart_location', POPULAR_REGIONS[0]);
    }

    getLocation() {
        return this.currentLocation || POPULAR_REGIONS[0];
    }

    setLocation(locData) {
        const fullData = {
            ...this.currentLocation,
            ...locData,
            updatedAt: new Date().toISOString()
        };

        // Guarantee currency locale exists
        if (!fullData.currencyLocale) {
            fullData.currencyLocale = this.getLocaleForCountry(fullData.countryCode);
        }

        const currInfo = CURRENCIES[fullData.currencyLocale] || CURRENCIES['en-US'];
        fullData.symbol = currInfo.symbol;
        fullData.currency = currInfo.code;

        this.currentLocation = fullData;
        storage.set('voice_cart_location', fullData);

        // Also sync address in checkout
        const currentAddr = storage.get('voice_cart_saved_address', {});
        storage.set('voice_cart_saved_address', {
            ...currentAddr,
            city: fullData.city || currentAddr.city || 'Springfield',
            zip: fullData.postalCode || currentAddr.zip || '10001'
        });

        eventBus.emit('location:updated', fullData);
        eventBus.emit('currency:updated', currInfo);
        return fullData;
    }

    getLocaleForCountry(countryCode) {
        const map = {
            'US': 'en-US',
            'IN': 'hi-IN',
            'GB': 'en-GB',
            'CA': 'en-CA',
            'AU': 'en-AU',
            'DE': 'de-DE',
            'FR': 'fr-FR',
            'IT': 'it-IT',
            'ES': 'es-ES',
            'NL': 'nl-NL',
            'BR': 'pt-BR',
            'CN': 'zh-CN',
            'JP': 'ja-JP',
            'KR': 'ko-KR',
            'SA': 'ar-SA',
            'AE': 'ar-AE',
            'RU': 'ru-RU',
            'SG': 'en-SG'
        };
        return map[countryCode?.toUpperCase()] || 'en-US';
    }

    /**
     * Resolve user input (PIN code, ZIP code, or City name) to a Location & Currency
     */
    resolveInput(rawInput) {
        const input = (rawInput || '').trim();
        if (!input) return null;

        const clean = input.toUpperCase();

        // 1. Indian 6-digit PIN code (e.g. 560001, 110001, 400001)
        if (/^\d{6}$/.test(clean)) {
            let city = 'Bengaluru';
            if (/^11/.test(clean)) city = 'Delhi';
            else if (/^40/.test(clean)) city = 'Mumbai';
            else if (/^60/.test(clean)) city = 'Chennai';
            else if (/^70/.test(clean)) city = 'Kolkata';
            else if (/^50/.test(clean)) city = 'Hyderabad';
            else if (/^41/.test(clean)) city = 'Pune';
            else if (/^38/.test(clean)) city = 'Ahmedabad';

            return {
                country: 'India',
                countryCode: 'IN',
                city: city,
                postalCode: clean,
                currency: 'INR',
                currencyLocale: 'hi-IN',
                symbol: '₹',
                flag: '🇮🇳',
                displayName: `${city}, India (${clean})`
            };
        }

        // 2. US 5-digit ZIP code (e.g. 10001, 90210, 94103)
        if (/^\d{5}$/.test(clean)) {
            let city = 'New York';
            if (/^90|^91|^92|^93|^94|^95|^96/.test(clean)) city = 'California';
            else if (/^60|^61|^62/.test(clean)) city = 'Chicago';
            else if (/^75|^76|^77/.test(clean)) city = 'Texas';
            else if (/^30|^31/.test(clean)) city = 'Atlanta';
            else if (/^33|^34/.test(clean)) city = 'Miami';
            else if (/^98/.test(clean)) city = 'Seattle';

            return {
                country: 'United States',
                countryCode: 'US',
                city: city,
                postalCode: clean,
                currency: 'USD',
                currencyLocale: 'en-US',
                symbol: '$',
                flag: '🇺🇸',
                displayName: `${city}, USA (${clean})`
            };
        }

        // 3. UK Postcode check (e.g. SW1A 1AA, EC1, W1, etc.)
        if (/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(clean) || /^(SW|NW|SE|NE|EC|WC|E|W|N)\d/i.test(clean)) {
            return {
                country: 'United Kingdom',
                countryCode: 'GB',
                city: 'London',
                postalCode: clean,
                currency: 'GBP',
                currencyLocale: 'en-GB',
                symbol: '£',
                flag: '🇬🇧',
                displayName: `London, UK (${clean})`
            };
        }

        // 4. Canadian Postcode (e.g. M5V 2T6)
        if (/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i.test(clean)) {
            return {
                country: 'Canada',
                countryCode: 'CA',
                city: 'Toronto',
                postalCode: clean,
                currency: 'CAD',
                currencyLocale: 'en-CA',
                symbol: 'CA$',
                flag: '🇨🇦',
                displayName: `Toronto, Canada (${clean})`
            };
        }

        // 5. City Name matching
        const lower = input.toLowerCase();

        // India cities
        if (/(mumbai|delhi|bengaluru|bangalore|hyderabad|chennai|kolkata|pune|ahmedabad|jaipur|noida|gurgaon|gurugram|kochi|goa|india|bharat)/i.test(lower)) {
            const cityName = input.charAt(0).toUpperCase() + input.slice(1);
            return {
                country: 'India',
                countryCode: 'IN',
                city: cityName,
                postalCode: '560001',
                currency: 'INR',
                currencyLocale: 'hi-IN',
                symbol: '₹',
                flag: '🇮🇳',
                displayName: `${cityName}, India (₹)`
            };
        }

        // UK cities
        if (/(london|manchester|birmingham|edinburgh|glasgow|liverpool|bristol|leeds|uk|england|britain)/i.test(lower)) {
            const cityName = input.charAt(0).toUpperCase() + input.slice(1);
            return {
                country: 'United Kingdom',
                countryCode: 'GB',
                city: cityName,
                postalCode: 'SW1A 1AA',
                currency: 'GBP',
                currencyLocale: 'en-GB',
                symbol: '£',
                flag: '🇬🇧',
                displayName: `${cityName}, UK (£)`
            };
        }

        // European cities
        if (/(paris|lyon|marseille|france)/i.test(lower)) {
            return { country: 'France', countryCode: 'FR', city: 'Paris', postalCode: '75001', currency: 'EUR', currencyLocale: 'fr-FR', symbol: '€', flag: '🇫🇷', displayName: 'Paris, France (€)' };
        }
        if (/(berlin|munich|frankfurt|hamburg|germany|deutschland)/i.test(lower)) {
            return { country: 'Germany', countryCode: 'DE', city: 'Berlin', postalCode: '10115', currency: 'EUR', currencyLocale: 'de-DE', symbol: '€', flag: '🇩🇪', displayName: 'Berlin, Germany (€)' };
        }
        if (/(rome|milan|naples|italy|italia)/i.test(lower)) {
            return { country: 'Italy', countryCode: 'IT', city: 'Rome', postalCode: '00100', currency: 'EUR', currencyLocale: 'it-IT', symbol: '€', flag: '🇮🇹', displayName: 'Rome, Italy (€)' };
        }
        if (/(madrid|barcelona|valencia|spain|espana)/i.test(lower)) {
            return { country: 'Spain', countryCode: 'ES', city: 'Madrid', postalCode: '28001', currency: 'EUR', currencyLocale: 'es-ES', symbol: '€', flag: '🇪🇸', displayName: 'Madrid, Spain (€)' };
        }

        // Japan / Tokyo
        if (/(tokyo|osaka|kyoto|japan|nippon)/i.test(lower)) {
            return { country: 'Japan', countryCode: 'JP', city: 'Tokyo', postalCode: '100-0001', currency: 'JPY', currencyLocale: 'ja-JP', symbol: '¥', flag: '🇯🇵', displayName: 'Tokyo, Japan (¥)' };
        }

        // UAE / Dubai
        if (/(dubai|abu dhabi|uae|emirates|sharjah)/i.test(lower)) {
            return { country: 'UAE', countryCode: 'AE', city: 'Dubai', postalCode: '00000', currency: 'AED', currencyLocale: 'ar-AE', symbol: 'AED', flag: '🇦🇪', displayName: 'Dubai, UAE (AED)' };
        }

        // Australia
        if (/(sydney|melbourne|brisbane|perth|australia)/i.test(lower)) {
            return { country: 'Australia', countryCode: 'AU', city: 'Sydney', postalCode: '2000', currency: 'AUD', currencyLocale: 'en-AU', symbol: 'A$', flag: '🇦🇺', displayName: 'Sydney, Australia (A$)' };
        }

        // Canada
        if (/(toronto|vancouver|montreal|ottawa|calgary|canada)/i.test(lower)) {
            return { country: 'Canada', countryCode: 'CA', city: 'Toronto', postalCode: 'M5V 2T6', currency: 'CAD', currencyLocale: 'en-CA', symbol: 'CA$', flag: '🇨🇦', displayName: 'Toronto, Canada (CA$)' };
        }

        // Fallback: Default to US
        return {
            country: 'United States',
            countryCode: 'US',
            city: input,
            postalCode: '10001',
            currency: 'USD',
            currencyLocale: 'en-US',
            symbol: '$',
            flag: '📍',
            displayName: `${input} ($)`
        };
    }

    /**
     * Detect user's current GPS location via Geolocation API
     */
    async detectCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                // Fallback to timezone heuristic
                return resolve(this.detectFromTimezone());
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        // OpenStreetMap Reverse Geocode
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                            { headers: { 'Accept-Language': 'en' } }
                        );
                        if (res.ok) {
                            const data = await res.json();
                            const addr = data.address || {};
                            const countryCode = (addr.country_code || 'US').toUpperCase();
                            const city = addr.city || addr.town || addr.county || addr.state || 'Local Area';
                            const postalCode = addr.postcode || '00000';
                            const country = addr.country || 'Current Location';

                            const currencyLocale = this.getLocaleForCountry(countryCode);
                            const currInfo = CURRENCIES[currencyLocale] || CURRENCIES['en-US'];

                            const locData = {
                                country,
                                countryCode,
                                city,
                                postalCode,
                                currency: currInfo.code,
                                currencyLocale,
                                symbol: currInfo.symbol,
                                flag: '📍',
                                displayName: `${city}, ${countryCode} (${postalCode})`
                            };

                            this.setLocation(locData);
                            return resolve(locData);
                        }
                    } catch (e) {
                        console.warn('Reverse geocoding error:', e);
                    }

                    // Fallback to timezone if reverse geocode fails
                    const tzLoc = this.detectFromTimezone();
                    this.setLocation(tzLoc);
                    resolve(tzLoc);
                },
                (error) => {
                    console.warn('Geolocation permission denied or error:', error);
                    // Fallback to browser timezone
                    const tzLoc = this.detectFromTimezone();
                    this.setLocation(tzLoc);
                    resolve(tzLoc);
                },
                { timeout: 8000, enableHighAccuracy: false }
            );
        });
    }

    /**
     * Heuristic detection based on Intl timezone
     */
    detectFromTimezone() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            if (/Calcutta|Kolkata|India/i.test(tz)) {
                return POPULAR_REGIONS.find(r => r.countryCode === 'IN');
            } else if (/London|Europe\/Belfast/i.test(tz)) {
                return POPULAR_REGIONS.find(r => r.countryCode === 'GB');
            } else if (/Berlin|Paris|Rome|Madrid|Amsterdam/i.test(tz)) {
                return POPULAR_REGIONS.find(r => r.id === 'eu_de');
            } else if (/Tokyo|Japan/i.test(tz)) {
                return POPULAR_REGIONS.find(r => r.countryCode === 'JP');
            } else if (/Toronto|Vancouver|Edmonton|Winnipeg/i.test(tz)) {
                return POPULAR_REGIONS.find(r => r.countryCode === 'CA');
            } else if (/Sydney|Melbourne|Brisbane|Perth/i.test(tz)) {
                return POPULAR_REGIONS.find(r => r.countryCode === 'AU');
            } else if (/Dubai|Riyadh|Qatar/i.test(tz)) {
                return POPULAR_REGIONS.find(r => r.countryCode === 'AE');
            }
        } catch (e) {}

        return POPULAR_REGIONS[0];
    }
}

export const locationService = new LocationService();
