# Inceptra Registration Features

## Image Caching

### Implementation
A service worker has been implemented to cache images across all pages for better performance:

- **Location**: `/static/service-worker.js`
- **Registration**: Automatically registered in `src/routes/+layout.svelte`
- **Strategy**: 
  - Images (png, jpg, jpeg, svg, gif, webp, ico): Cache-first strategy
  - Other resources: Network-first with cache fallback
  - Automatic cache versioning for easy updates

### Benefits
- Faster page loads on subsequent visits
- Reduced bandwidth usage
- Better offline experience
- Improved perceived performance

### Cache Management
- Images are cached indefinitely until cache version changes
- Old caches are automatically cleaned up on service worker update
- Cache name: `inceptra-images-v1`

## LocalStorage Form Auto-Save

### Implementation
Registration form data is automatically saved to localStorage for incomplete submissions:

- **Location**: `src/lib/components/Register.svelte`
- **Storage Key**: `inceptra_registration_draft`
- **Auto-save**: Data is saved 1 second after user stops typing

### Features
1. **Auto-Save**: Form data is automatically saved as users fill it out
2. **Auto-Restore**: Data is restored when users return to the registration page
3. **Expiration**: Saved data expires after 24 hours
4. **Auto-Clear**: Data is cleared upon successful form submission
5. **Privacy**: Data is only stored in the user's browser

### Saved Data
The following information is preserved:
- Personal information (name, email, phone, etc.)
- Selected registration type (symposium/cultural)
- Selected department and events
- Current step in the registration process
- Payment method selection
- Form timestamp

### User Experience
- Users can safely close the browser during registration
- Form progress is maintained across browser sessions
- No data loss if the browser crashes
- Seamless continuation of incomplete registrations

## Testing

### Service Worker Testing
1. Open browser DevTools → Application → Service Workers
2. Verify service worker is registered
3. Check Cache Storage to see cached images
4. Test offline by enabling "Offline" checkbox

### LocalStorage Testing
1. Start filling the registration form
2. Wait 1 second (auto-save triggers)
3. Close the browser tab
4. Reopen the registration page
5. Form should be restored with previous data
6. Check DevTools → Application → Local Storage → `inceptra_registration_draft`

## Browser Compatibility
- Service Workers: Modern browsers (Chrome 40+, Firefox 44+, Safari 11.1+)
- LocalStorage: All modern browsers
- Graceful degradation for older browsers
