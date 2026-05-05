# Mobile Google Authentication Fix

## Problem
Google Sign-In was failing on mobile browsers with the error:
> "Unable to process request due to missing initial state. This may happen if browser sessionStorage is inaccessible or accidentally cleared."

This occurred because mobile browsers (especially in incognito/private mode or with strict privacy settings) often clear sessionStorage during OAuth redirects.

## Solution Applied

### 1. **Dual Storage Strategy** (`GoogleLoginButton.jsx`)
- Now stores the user role in **both** `sessionStorage` AND `localStorage` before redirect
- After redirect, checks both storage locations (sessionStorage first, then localStorage as fallback)
- Cleans up both storage locations after successful authentication

### 2. **Firebase Persistence** (`firebase.js`)
- Set Firebase auth persistence to `browserLocalPersistence` instead of default session persistence
- This ensures Firebase auth state survives page redirects on mobile
- Added `prompt: 'select_account'` to Google provider to force account selection

### 3. **Global Redirect Handling** (`App.jsx`)
- Updated global redirect handler to check both storage locations
- Better error logging for debugging

## Files Modified
1. `frontend/src/components/GoogleLoginButton.jsx`
2. `frontend/src/firebase.js`
3. `frontend/src/App.jsx`

## Testing Checklist
- [ ] Test on mobile Chrome (Android)
- [ ] Test on mobile Safari (iOS)
- [ ] Test in incognito/private mode
- [ ] Test with "Block third-party cookies" enabled
- [ ] Test student role login
- [ ] Test teacher role login
- [ ] Verify desktop popup flow still works

## Additional Troubleshooting

If the issue persists on some mobile browsers:

### Option 1: Add URL Parameter Fallback
Store role in URL query parameter as additional fallback:
```javascript
// Before redirect
const redirectUrl = `${window.location.origin}/login/student?role=${role}`;
// Then read from URL params after redirect
```

### Option 2: Use Popup on Mobile (if supported)
Some modern mobile browsers support popups. You can try popup first, fallback to redirect:
```javascript
try {
  const result = await signInWithPopup(auth, googleProvider);
  // Handle success
} catch (err) {
  if (err.code === 'auth/popup-blocked') {
    // Fallback to redirect
    await signInWithRedirect(auth, googleProvider);
  }
}
```

### Option 3: Server-Side Session
Store the role on the server temporarily using a session ID passed via URL.

## Browser Compatibility Notes
- **Chrome Mobile**: Should work with localStorage fallback
- **Safari iOS**: May have strict privacy settings; localStorage should help
- **Firefox Mobile**: Generally good support
- **Samsung Internet**: May need additional testing
- **Incognito/Private Mode**: localStorage may also be restricted; consider URL parameter approach

## Security Considerations
- Role stored in localStorage is client-side only and temporary
- Server validates the role when creating/updating user account
- Storage is cleared immediately after successful authentication
- No sensitive data (tokens, passwords) stored in localStorage
