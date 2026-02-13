# Testing Guide: Image Caching & Form Auto-Save

## Quick Test Checklist

### 1. Service Worker & Image Caching

**Steps to verify:**
1. Open the application in the browser
2. Open DevTools (F12)
3. Go to **Application** → **Service Workers**
   - ✅ You should see `/service-worker.js` registered and activated
   - Status should be "activated and running"

4. Navigate to different pages with images (home, about, cultural, symposium, etc.)
5. Go to **Application** → **Cache Storage**
   - ✅ You should see two caches:
     - `inceptra-v1` (static assets)
     - `inceptra-images-v1` (images)
   - Check the image cache - it should contain the images you've viewed

6. **Test offline functionality:**
   - In DevTools → Network tab, check "Offline"
   - Refresh the page
   - ✅ Images should still load from cache
   - Uncheck "Offline" when done

### 2. Form Auto-Save to LocalStorage

**Steps to verify:**

#### Test 1: Auto-Save During Form Fill
1. Navigate to `/register` page
2. Start filling out the registration form:
   - Enter your name
   - Enter email, phone
   - Select a registration type (Symposium or Cultural)
   - Fill in other fields

3. Open DevTools → **Application** → **Local Storage** → `http://localhost:5173`
   - ✅ Look for key: `inceptra_registration_draft`
   - Click on it to see the saved JSON data
   - It should contain all your form entries

4. **Wait 1 second** after typing (auto-save delay)
5. Refresh the page or check localStorage again
   - ✅ Your data should be saved

#### Test 2: Data Restoration
1. Continue from Test 1 (with data in localStorage)
2. **Close the browser tab** completely
3. **Reopen** the browser and navigate to `/register`
4. ✅ You should see:
   - A **green notification banner** at the top saying "Form Data Restored"
   - All your previously entered data should be filled in
   - The notification auto-hides after 5 seconds (or click X to dismiss)

#### Test 3: Data Expiration (24 hours)
1. To test expiration without waiting 24 hours:
   - Open DevTools → Application → Local Storage
   - Edit `inceptra_registration_draft`
   - Find the `timestamp` value
   - Change it to a value from 2+ days ago (e.g., change last 10 digits)
   - Refresh the page
   - ✅ Data should NOT be restored (too old)

#### Test 4: Auto-Clear on Successful Submission
1. Fill out the complete registration form
2. Proceed through payment step
3. Submit the form successfully
4. Check DevTools → Application → Local Storage
   - ✅ `inceptra_registration_draft` should be **deleted**
5. Return to registration page
   - ✅ Form should be empty (fresh start)

## Console Output

When testing, you should see these console messages:

### Service Worker:
```
Service Worker registered: ServiceWorkerRegistration {...}
```

### Form Auto-Save:
```
Form data saved to localStorage
```

### Form Restoration:
```
Form data restored from localStorage
```

### Successful Submission:
```
Saved form data cleared
```

## Troubleshooting

### Service Worker not registering?
- Make sure you're not in private/incognito mode
- Clear browser cache and reload
- Check browser console for errors

### LocalStorage not saving?
- Check browser console for quota errors
- Make sure you're not in private/incognito mode (some browsers block localStorage)
- Clear existing localStorage and try again

### Form data not restoring?
- Check if data exists in localStorage (DevTools → Application → Local Storage)
- Check console for restoration errors
- Verify timestamp is less than 24 hours old

## Browser Debugging

### View Service Worker State:
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs))
```

### View Cached Images:
```javascript
// In browser console
caches.keys().then(keys => console.log('Caches:', keys))
caches.open('inceptra-images-v1').then(cache => 
  cache.keys().then(keys => console.log('Cached images:', keys))
)
```

### View Saved Form Data:
```javascript
// In browser console
JSON.parse(localStorage.getItem('inceptra_registration_draft'))
```

### Clear Everything (Reset):
```javascript
// In browser console - USE WITH CAUTION!
// Clear localStorage
localStorage.clear()

// Unregister service workers
navigator.serviceWorker.getRegistrations().then(regs => 
  regs.forEach(reg => reg.unregister())
)

// Clear all caches
caches.keys().then(keys => 
  keys.forEach(key => caches.delete(key))
)
```

## Expected User Experience

### Image Caching:
- ✅ First visit: Images load from network (slower)
- ✅ Subsequent visits: Images load from cache (instant)
- ✅ Offline: Images still available from cache
- ✅ Reduced data usage on repeat visits

### Form Auto-Save:
- ✅ No interruption while typing
- ✅ Can safely close browser mid-registration
- ✅ Progress preserved for 24 hours
- ✅ Clear visual feedback when data is restored
- ✅ Automatic cleanup on successful submission

## Performance Testing

### Before/After Comparison:
1. Clear all caches
2. Load the home page with DevTools Network tab open
3. Note the total size and load time
4. Refresh the page
5. ✅ Second load should be significantly faster with most images from service worker cache

### Check Network Tab:
- Images from cache show: **(Service Worker)**
- Images from network show: **200** or **304**

---

**Note:** All features gracefully degrade in older browsers that don't support Service Workers or LocalStorage.
