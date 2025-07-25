# Changelog

## Two-Factor Authentication and Security Question Inline Form (2025-07-25)

Updated TwoFactorAuthScreen to include inline form for setting security questions:

1. **TwoFactorAuthScreen**:
   - Enhanced to control security question enablement with the 2FA switch
   - Inline bottom sheet form for security question instead of separate screen
   - Security questions available in a drop-down
   - Included styling for disabled state when 2FA is off

2. **SecurityQuestionScreen**: Removed file as functionality is now inline

3. **Navigation Updates**:
   - Modified App.tsx to remove SecurityQuestionScreen entry
   - Updated navigation and route parameters accordingly

4. **UI Enhancements**:
   - Adapted design to fit in a bottom sheet within the same screen
   - Matching the visual style with provided design inputs and colors

## Change Security PIN Screen Keyboard Improvements

Improved keyboard handling on the Change Security PIN screen:

1. **Keyboard Behavior Enhancements**:
   - Added KeyboardAvoidingView to prevent keyboard from covering input fields
   - Implemented ScrollView with proper configuration for keyboard interaction
   - Added refs to TextInput components for focus management between fields
   - Set up proper returnKeyType and onSubmitEditing handlers for seamless input flow

2. **User Experience Improvements**:
   - Automatic focus progression from Old PIN to New PIN to Repeat PIN fields
   - "Done" button on the keyboard now triggers the Save PIN action
   - Keyboard is automatically dismissed when saving PIN
   - Screen content scrolls when keyboard appears to ensure all elements remain accessible

## Change Security PIN Screen Addition (2025-07-24)

Added a new screen for changing security PIN:

1. **New Files**:
   - Created `screens/profile/ChangePinScreen.tsx` with fields for old PIN, new PIN, and repeat new PIN
   - Implemented toggle visibility for PIN fields with eye icon
   - Added Save PIN button at the bottom of the screen

2. **Navigation Updates**:
   - Added ChangePinScreen to App.tsx navigation stack
   - Updated SecurityScreen to navigate to ChangePin when the Change Security Pin option is pressed

3. **UI Features**:
   - Custom styled PIN input fields with toggle visibility icons
   - Consistent styling with the security screen design guidelines
   - Specific colors as provided: 
     - Input background: #F2F2F2
     - Button background: #EAEAEA
     - Input text color: #1C1C1C
     - Input eye icon color: #B0B0B0
     - Button text color: #3B3B3B
   - Form validation structure for PIN changes

## Terms & Conditions Screen Addition (2025-07-24)

Added a new terms and conditions screen to display the app's data usage policies:

1. **New Files**:
   - Created `screens/profile/TermsConditionsScreen.tsx` with detailed sections on data collection and usage
   - Implemented bullet point lists for better readability of policy items
   - Organized content into clear sections following the design mockup

2. **Navigation Updates**:
   - Added TermsConditionsScreen to App.tsx navigation stack
   - Updated SupportHelpScreen to navigate to TermsConditions when the Terms & Conditions option is pressed

3. **UI Features**:
   - Custom bullet point list implementation for policy details
   - Consistent styling with other policy screens (font sizes, weights, spacing)
   - Proper scrolling for the content with organized section layout
   - Used the same styling pattern as seen in the Privacy Policy screen

## Privacy Policy Screen Addition (2025-07-24)

Added a new privacy policy screen to display the app's terms and conditions:

1. **New Files**:
   - Created `screens/profile/PrivacyPolicyScreen.tsx` with detailed privacy policy sections
   - Structured content with section titles and descriptions for easy readability

2. **Navigation Updates**:
   - Added PrivacyPolicyScreen to App.tsx navigation stack
   - Updated SupportHelpScreen to navigate to PrivacyPolicy when the Privacy Policy option is pressed

3. **UI Features**:
   - Implemented clean, organized sections for different policy topics
   - Added proper scrolling for long content
   - Maintained consistent styling with other profile section screens

4. **Style Changes Made to PrivacyPolicyScreen**:
   - Changed header text font size from 18px to 16px (line 103)
   - Updated header text font weight from '600' to '500' (line 104)
   - Changed section margins from marginBottom: 24 to marginVertical: 24 (line 112)
   - Reduced section title font size from 16px to 14px (line 115)
   - Changed section title font weight from '600' to '500' (line 116)
   - Reduced section content font size from 14px to 12px (line 121)
   - These changes provide a more consistent look across all settings screens

## Support & Help Screen Addition (2025-07-24)

Added a new support and help screen in the profile section:

1. **New Files**:
   - Created `screens/profile/SupportHelpScreen.tsx` with options for Privacy Policy, Terms & Conditions, and Contact Support
   - Designed with the same clean styling as the Security and Notification Settings screens

2. **Navigation Updates**:
   - Added SupportHelpScreen to App.tsx navigation stack
   - Updated ProfileScreen to navigate to SupportHelp when the Support & Help section is pressed

3. **UI Features**:
   - Implemented navigation options with ChevronRight icons for Privacy Policy and Terms & Conditions
   - Added ExternalLink icon for the Contact Support option
   - Used the same consistent styling pattern as seen in other profile section screens

## Notification Settings Screen Addition (2025-07-24)

Added a new notification settings screen in the profile section:

1. **New Files**:
   - Created `screens/profile/NotificationSettingsScreen.tsx` with toggles for push notifications, email notifications, and SMS alerts
   - Designed with the same clean styling as the Security screen

2. **Navigation Updates**:
   - Added NotificationSettingsScreen to App.tsx navigation stack
   - Updated ProfileScreen to navigate to NotificationSettings instead of Notifications when the Notification section is pressed

3. **UI Features**:
   - Implemented toggle switches for each notification type
   - Added descriptive text for each notification option
   - Used the same styling pattern as seen in the Security screen

## Security Screen Changes (2025-07-24)

The following changes were made to the `screens/profile/SecurityScreen.tsx` file:

1. **UI Additions**:
   - Added `ChevronRight` import from 'lucide-react-native' (line 6)
   - Added ChevronRight icons to all options except the biometrics toggle (lines 42, 50, 69)
   - Set the color of ChevronRight icons to "#4D4845"

2. **Style Changes**:
   - Removed border bottom styling from header (removed borderBottomWidth and borderBottomColor)
   - Increased vertical margin for description text from 16px to 20px (line 98)
   - Increased paddingVertical for options from 12px to 16px (line 104)
   - Changed optionTitle font weight from '500' to '400' (line 112)
   - Changed optionTitle text color from '#111827' to '#1E1E1E' (line 113)
   - Removed border styling from options (removed borderBottomWidth and borderBottomColor)

These changes provide a cleaner, more consistent UI that better matches the provided design screenshot.
