# Changelog

## Member Details Modal Implementation (2025-07-29)

Implemented a Member Details modal sheet in AllMembersScreen that appears when clicking on any member:

1. **Modal Sheet Features**:
   - **Member Avatar**: Large circular profile image (80x80) centered at top
   - **Member Info**: Name and role displayed below avatar
   - **Meta Information**: Date joined, member count, and monthly contribution with blue icons
   - **Next Payment Card**: Pink card showing next payment date with calendar icon
   - **Details Section**: Group name, pickup date, amount contributed, and contribution status
   - **Close Button**: X button in top-right corner

2. **Visual Design**:
   - White background with rounded top corners (20px radius)
   - Pink background (#FEE2E2) for next payment card
   - Blue icons (#3B82F6) for meta information
   - Green color (#10B981) for "Paid" status
   - Proper spacing and typography matching the screenshot

3. **Technical Implementation**:
   - Added click handlers to all member items (both current user and other members)
   - State management for selected member and modal visibility
   - Dynamic contribution status based on member's hasPaid property
   - Smooth slide animations with react-native-modal

4. **User Interaction**:
   - Clicking on any member opens their details modal
   - Modal can be dismissed by tapping backdrop or close button
   - Shows different status (Paid/Not Paid) based on member data
   - Consistent interaction pattern across all members

## Group Info Modal Implementation (2025-07-29)

Implemented a Group Info modal sheet in AllMembersScreen that appears when "View group info" button is clicked:

1. **Modal Sheet Features**:
   - **Title**: "Group info" with close (X) button
   - **Status Indicators**: Green circle for "Paid Status", Red circle for "Not paid Status"
   - **Description**: Detailed explanation of payment tracking functionality
   - **Tips Section**: Three bullet points with helpful information about member interactions
   - **Slide Animation**: Smooth slide-up animation when opening, slide-down when closing

2. **Visual Design**:
   - White background with rounded top corners (20px radius)
   - Proper spacing and typography matching the screenshot
   - Status indicators with green (#34D399) and red (#EF4444) colors
   - Gray text (#6B7280) for descriptions and tips
   - Bold title and section headers

3. **Technical Implementation**:
   - Used react-native-modal library for the modal functionality
   - Added state management with useState hook for visibility control
   - Modal positioned at bottom of screen with backdrop opacity
   - Can be dismissed by tapping backdrop or close button
   - Properly separated from ScrollView for correct rendering

4. **User Interaction**:
   - "View group info" button triggers modal display
   - Modal slides up from bottom with smooth animation
   - Multiple ways to close: X button or backdrop tap
   - Responsive layout that works across different screen sizes

## AllMembersScreen UI Enhancement (2025-07-29)

Completely redesigned the AllMembersScreen to match the provided screenshots with all missing components:

1. **Screen Structure Updates**:
   - Added proper group header section with title, subtitle, and member count badge
   - Separated current user ("Me") from other members with distinct sections
   - Added "Members" section label between current user and member list
   - Implemented summary footer with member/admin count
   - Added "View group info" button at the bottom

2. **UI Component Additions**:
   - **Member Count Badge**: Blue users icon with "15" count in header
   - **Online Indicators**: Green/red dots on member avatars showing online status
   - **Section Labels**: Added "Members" section divider
   - **Summary Footer**: Users icon with "14 members & 1 Admin." text
   - **View Group Info Button**: Black rounded button at bottom

3. **Member Data Structure**:
   - Updated member data to include role (Member/Group Admin)
   - Added online status for each member
   - Proper separation of current user vs other members
   - Total of 16 members matching screenshot requirements

4. **Visual Styling Updates**:
   - Increased avatar size to 56x56 pixels
   - Updated online indicator positioning and size (16x16 with 3px white border)
   - Header title font size 18px with weight 600
   - Group title font size 24px with weight 600
   - Member names font size 16px with weight 500
   - Proper spacing and padding throughout
   - Removed divider lines between members for cleaner look

5. **Layout Improvements**:
   - Group header with flex layout for title/subtitle and member count
   - Consistent padding (20px horizontal) throughout
   - Proper bottom padding for scroll content
   - Black button styling matching app design patterns

## GroupFundedScreen Implementation (2025-07-29)

Implemented a new success screen for completed group contributions, based on WalletFundedScreen but tailored for group deposits:

1. **New Screen Created** (`screens/groups/GroupFundedScreen.tsx`):
   - Success screen showing after successful group contribution
   - Exact clone of WalletFundedScreen with group-specific content
   - Includes 3-second loading screen before showing success state
   - Clean success interface matching the provided screenshot design

2. **Loading State Features**:
   - **3-Second Timer**: Shows "Confirming payment..." with activity indicator
   - **Loading Screen**: Centered loading spinner with status text
   - **Auto-Transition**: Automatically transitions to success state after 3 seconds
   - **Loading Text**: "Confirming payment..." message during processing

3. **Success State Features**:
   - **Success Icon**: Green checkmark icon (approved.png) at 80x80 pixels
   - **Success Title**: "Wallet Funded" heading
   - **Success Message**: "Payment successful! Your contribution has been recorded and reflected in the group."
   - **Transaction Details**: Card showing group name, contribution amount, payment method, and total
   - **Go Home Button**: Button with home icon to navigate back to main screen

4. **Transaction Details Card**:
   - **Group Name**: Shows the contributing group (Hawaii Vacation)
   - **Contribution Amount**: User-entered amount from deposit screen
   - **Payment Method**: Shows "Wallet" as payment source
   - **Dashed Divider**: Separating details from total amount
   - **Total Amount**: Properly formatted with decimal places

5. **Navigation Integration**:
   - **Route Parameters**: Accepts amount and groupName parameters
   - **Navigation Flow**: MakeDeposit → Confirmation Modal → GroupFunded → Home
   - **Back Button**: Arrow left button to navigate back
   - **Go Home Button**: Navigate to MainTabs Home screen
   - **Added to App.tsx**: Route type and stack screen configuration

6. **UI Design Elements**:
   - **Consistent Styling**: Matches WalletFundedScreen design patterns
   - **Gray Details Card**: #F2F2F2 background with rounded corners
   - **Proper Typography**: Consistent font sizes, weights, and colors
   - **Center Alignment**: Success content centered on screen
   - **Responsive Layout**: Works across different screen sizes

7. **Technical Implementation**:
   - **useEffect Hook**: 3-second timer implementation with cleanup
   - **useState**: Loading state management
   - **Route Parameters**: Proper TypeScript typing for navigation params
   - **Conditional Rendering**: Loading state vs success state
   - **Asset Integration**: Uses approved.png success icon

8. **User Experience Features**:
   - **Loading Feedback**: Clear indication that payment is being processed
   - **Success Confirmation**: Visual and textual confirmation of successful deposit
   - **Transaction Summary**: Complete details of what was processed
   - **Easy Navigation**: Clear path back to main app areas
   - **Professional Feel**: Mimics real banking/payment app experiences

## MakeDepositScreen Implementation with Confirmation Modal (2025-07-29)

Implemented a new "Make a Deposit" screen for group contributions with confirmation modal, similar to the FundWalletScreen but tailored for group deposits:

1. **New Screen Created** (`screens/groups/MakeDepositScreen.tsx`):
   - Simplified deposit screen focusing on group contributions
   - Clean interface matching the provided screenshot design
   - Header with "Fund Group" title and back navigation
   - Three main input sections for group funding process
   - Payment confirmation modal sheet

2. **Key Features Implemented**:
   - **Group Selection**: Pre-filled with "Hawaii Vacation" group name
   - **Payment Method**: Shows "Wallet" as the payment source
   - **Amount Input**: Editable text field for contribution amount ($100 default)
   - **Next Payment Date**: Display of upcoming payment date (1/07/2025)
   - **Proceed Button**: Opens confirmation modal before processing deposit

3. **Confirmation Modal Features**:
   - **Modal Sheet**: Slides up from bottom when "Proceed" button is pressed
   - **Payment Summary**: Shows group name, contribution amount, payment method
   - **Total Display**: Formatted total amount with proper decimal formatting
   - **Action Buttons**: Close (X) button and "Confirm payment" button
   - **Modal Controls**: Can be dismissed by backdrop press or close button

4. **UI Design Elements**:
   - Consistent styling with existing app screens and invite member sheet pattern
   - Gray input containers with rounded corners (#F2F2F2 background)
   - Modal with white background, rounded top corners, and proper padding
   - Dashed divider line separating contribution details from total
   - Proper spacing and typography matching app standards
   - Responsive layout with KeyboardAvoidingView for mobile input

5. **Navigation Integration**:
   - Added MakeDeposit route to App.tsx navigation types and stack
   - Updated GroupDetailScreen to navigate to MakeDeposit when "Make a deposit" button is pressed
   - Modal integration with react-native-modal library for smooth animations
   - Proper TypeScript integration with navigation prop types

6. **Technical Implementation**:
   - Based on FundWalletScreen structure but simplified for group deposits
   - Modal state management with useState hook for visibility control
   - Proper ScrollView with keyboard handling for mobile optimization
   - State management for amount input with dollar sign formatting
   - Clean component architecture following React Native best practices
   - Modal styling consistent with GroupDetailScreen invite member sheet

7. **User Experience Features**:
   - Immediate feedback with pre-filled group information
   - Clear visual hierarchy with section labels and input descriptions
   - Confirmation step prevents accidental deposits
   - Smooth modal animations with backdrop opacity
   - Intuitive flow from group detail → deposit form → confirmation → completion
   - Consistent button styling and interaction patterns

## Invite Member Sheet UI Improvements (2025-07-29)

Enhanced the invite member bottom sheet UI in GroupDetailScreen with improved layout and styling:

1. **Layout Restructure**:
   - Updated social icons from horizontal row layout to vertical stack layout within circular containers
   - Each social icon now has its own circular background container (56x56 pixels)
   - Text labels positioned below each icon for better visual hierarchy
   - Icons arranged horizontally with space-between distribution

2. **Visual Enhancements**:
   - Social icons now use light blue circular backgrounds (#E2E7FF)
   - Icon colors updated to primary blue (#3358FF) for consistency
   - Text labels styled with black color (#000000) and increased font size (14px)
   - Added proper spacing and margins between icon containers

3. **Technical Updates**:
   - Modified socialIcons container to use flexDirection: 'row' with justifyContent: 'space-between'
   - Added new socialIconContainer style for individual icon spacing and alignment
   - Updated socialIcon style to create fixed 56x56 circular containers
   - Enhanced socialIconText styling for better text presentation

4. **User Experience**:
   - Improved touch targets with larger circular icon containers
   - Better visual grouping of icons and labels
   - Maintained all existing functionality while enhancing visual appeal
   - Consistent with overall app design language and color scheme

## Invite Member Sheet Implementation (2025-07-28)

Added a comprehensive invite member modal sheet to the GroupDetailScreen:

1. **New Feature**:
   - Implemented bottom sheet modal that slides up when "Invite member" button is pressed
   - Based on the same pattern used in GroupCreatedScreen for consistency
   - Uses react-native-modal library for smooth slide animations

2. **Sheet Content**:
   - "Invite member" title with subtitle "Invite members to your group"
   - Three bullet points explaining invitation guidelines:
     • Bring your circle together, invite friends to join and start saving as a team
     • Invite friends, family, or contacts you trust to contribute and follow through
     • Make sure you don't exceed the group's maximum member limit
   - "Send invite link via" section with social media icons

3. **Social Sharing Options**:
   - Facebook icon (blue #1877F2)
   - Instagram icon (pink #C13584)
   - WhatsApp icon (green #25D366)
   - Copy link icon (black #000000)
   - All icons are touchable and arranged horizontally

4. **Technical Implementation**:
   - Added useState hook for modal visibility control
   - Modal closes on backdrop press or when other actions are taken
   - Proper styling with white background, rounded top corners, and padding
   - Consistent with app's design language and color scheme

## GroupDetailScreen UI Updates and Bug Fixes (2025-07-28)

### Bug Fixes:
- Fixed profile image path in GroupDetailScreen to use correct asset location (../../assets/images/profile.png)
- Updated header gradient background color to match UI design (#F0D4C7)
- Replaced complex group icon with profile.png image for consistency
- Resolved JSX syntax error in TouchableOpacity closing tags

## GroupDetailScreen Implementation (2025-07-28)

Implemented a comprehensive group detail screen that displays complete information about individual savings groups:

1. **New Screen Created** (`screens/groups/GroupDetailScreen.tsx`):
   - Full-featured group details page matching the provided design mockup
   - Pink gradient header with back navigation and "Group details" title
   - Group icon with edit functionality and member count badge
   - Complete group information display (name, status, amount, metadata)

2. **Key Features Implemented**:
   - **Group Header**: Icon with edit button, group name, and status display
   - **Financial Info**: Large amount display with date, member count, and monthly contribution
   - **Description Section**: Detailed group purpose and savings goal explanation
   - **Next Pickup Info**: Card showing next collection person and date
   - **Recent Activities**: List of recent transactions (deposits, collections) with user avatars
   - **Group Members**: Member list with online indicators, roles (Admin/Member), and chevron navigation
   - **Bottom Actions**: "Invite member" and "Make a deposit" buttons

3. **UI Components Reused**:
   - Activity items cloned from `RecentActivitiesScreen.tsx` for consistency
   - Same avatar URLs and styling patterns for user profiles
   - Consistent icon usage (Calendar, Users, DollarSign, Edit3, ChevronRight)
   - Matching color scheme and typography from existing screens

4. **Navigation Integration**:
   - Added GroupDetail route to App.tsx navigation types and stack
   - Updated GroupsScreen to make all group cards clickable
   - Group cards now navigate to GroupDetail with groupName and groupId parameters
   - "View all activities" button navigates to RecentActivitiesScreen

5. **Technical Implementation**:
   - Proper ScrollView with content container styling for smooth scrolling
   - Gradient header background with proper positioning
   - Responsive layout with appropriate padding and margins
   - TypeScript integration with proper navigation prop types

6. **User Experience Features**:
   - Smooth scrolling with proper bottom padding for content visibility
   - Interactive elements with proper touch feedback
   - Consistent styling with other app screens
   - Clean, organized information hierarchy

## GroupsScreen Scrolling Issue Fix (2025-07-28)

Resolved scrolling difficulty in the GroupsScreen where users could only scroll properly when touching near the bottom navigation area:

1. **Root Cause Identified**:
   - BottomNavigation component positioned absolutely at bottom was interfering with ScrollView touch handling
   - Insufficient content padding was causing scroll content to be hidden behind bottom navigation
   - Missing proper scroll content container configuration

2. **Technical Fixes Applied**:
   - Added `contentContainerStyle` prop to ScrollView with proper `flexGrow: 1`
   - Increased bottom padding to 120px to ensure content clears the bottom navigation
   - Added `keyboardShouldPersistTaps="handled"` for better touch handling
   - Enabled `bounces={true}` for natural iOS-style scrolling behavior
   - Disabled vertical scroll indicator with `showsVerticalScrollIndicator={false}`

3. **Layout Improvements**:
   - Removed redundant `paddingBottom: 80` from content style
   - Centralized bottom spacing management in `scrollContent` style
   - Ensured proper content height calculation with `flexGrow: 1`

4. **User Experience Enhancement**:
   - Smooth scrolling throughout the entire screen area
   - No more scroll conflicts with bottom navigation
   - Proper content visibility at all scroll positions
   - Natural scroll behavior that matches platform conventions

## App Navigation Restructure: Splash and Welcome Screens (2025-07-28)

Restructured the app's initial navigation flow by separating the splash screen from the welcome screen:

1. **New Splash Screen** (`screens/splash/SplashScreen.tsx`):
   - Created a minimal, true splash screen that shows immediately when app opens
   - Blue gradient background (#3358FF) with bg.png overlay
   - White Ajo logo (ajowhite.png) with 116px height in center
   - Tagline: "A smarter way to save together." (18px, regular, white)
   - Auto-navigates to Welcome screen after 3 seconds

2. **New Welcome Screen** (`screens/welcome/WelcomeScreen.tsx`):
   - Moved previous splash screen content to dedicated welcome screen
   - Contains onboarding content with "Create account" and "Login" buttons
   - Uses bg.png background with people using phones image
   - Serves as the user's first interaction point for account creation/login

3. **Navigation Flow Updates**:
   - App opens → Splash Screen (3s) → Welcome Screen → Signup/Login
   - Added Welcome screen to navigation types and stack in App.tsx
   - Updated imports and route definitions

4. **Technical Implementation**:
   - Created new `/screens/welcome/` directory structure
   - Maintained existing functionality while improving user experience
   - Proper separation of concerns between branding (splash) and onboarding (welcome)

5. **User Experience Enhancement**:
   - Standard mobile app flow with immediate branding display
   - Smooth transition from app launch to user onboarding
   - Clear distinction between loading state and interactive onboarding

## Login Screen Redesign (2025-07-28)

Completely redesigned the login screen to match the new PIN-based authentication design:

1. **Layout Changes**:
   - Added back arrow navigation at the top left
   - Updated title to "Login" with large bold font (32px)
   - Changed subtitle to "Welcome back. Let's get you where you left off."
   - Replaced email/password fields with PIN input system

2. **PIN Authentication System**:
   - Added "Input Pin" label with PIN input field
   - Implemented secure PIN entry with toggle visibility (Eye/EyeOff icons)
   - PIN input supports up to 6 digits with numeric keypad
   - Gray background (#F5F5F5) with rounded corners for input field

3. **Interactive Elements**:
   - "Proceed" button (black background, white text, rounded)
   - "Use face ID 😊" button positioned at bottom with border styling
   - Both buttons navigate to MainTabs when pressed
   - Back button navigates to previous screen

4. **UI Improvements**:
   - Clean, minimal design with proper spacing and typography
   - Consistent color scheme with black text and gray accents
   - Mobile-friendly layout with appropriate padding and margins
   - Enhanced user experience with biometric authentication option

5. **Technical Updates**:
   - Replaced email/password state with PIN state management
   - Added show/hide PIN functionality with eye icon toggle
   - Imported Lucide React Native icons (ArrowLeft, Eye, EyeOff)
   - Removed dependency on custom Input and Button components

## Splash Screen Redesign (2025-07-28)

Completely redesigned the splash screen to match the new onboarding design:

1. **Background Update**:
   - Replaced LinearGradient background with bg.png image background
   - Used ImageBackground component for better visual appeal

2. **Layout Changes**:
   - Removed animated loading dots and auto-navigation timer
   - Added blue "Ajo" title at the top (fontSize: 48, color: #3B82F6)
   - Repositioned main splash image in the center
   - Added descriptive text: "Join forces with friends, family, or teams to reach your goals faster."

3. **Interactive Elements**:
   - Added "Create account" button (black background, white text, rounded)
   - Added "Already have an account: Login here" link with blue underlined text
   - Both buttons navigate to respective screens (Signup/Login)

4. **UI Improvements**:
   - Updated layout to use space-between justification for better distribution
   - Added proper padding and margins for mobile-friendly design
   - Improved typography with better font weights and sizes
   - Enhanced user experience with clear call-to-action buttons

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
