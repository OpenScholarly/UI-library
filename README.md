# UI-library

https://uiverse.io/
https://uiverse.io/jeremyssocial/ugly-bullfrog-62
https://shuffle.dev/marketplace


https://animejs.com/
https://reactbits.dev/text-animations/circular-text

https://icomoon.io/

https://mobbin.com/explore/web/ui-elements/card
https://mobbin.com/collections/72af2281-5c22-4a5d-ac12-ce6ac37e215d/web/screens
https://m3.material.io/
https://getbootstrap.com/docs/5.3/examples/

https://activitypub.rocks/
https://waapi.readme.io/reference/waapi-api-documentation



# Requirements
## Features
### P1
- [x] User notification handling (room joining)
- [x] Overflow sur score
- [x] Mobile friendliness (login, register, landing, waiting, navbar, sidebar, invite, tag-list, profile, description, library, home, explore, edit, create, notifications, score, recap, questions)
- [x] 404 page
- [x] Store sidebar toggle value between page refresh
- [x] Search bars alignement + search working again + scroll in dropdown
- [x] FIX HOMEPAGE
- [x] Fix checkmark on all recap
- [x] Fix dark mode toggle on mobile
- [x] Recheck mobile friendliness
- [x] disable quiz creation if not questions
- [x] reject notifications

### P2
- [x] Notifications when get call fails
- [x] Profile pop-up menu with dark mode toggle, logout
- [x] Dark mode (toggle + persist in localStorage + apply to all components + prefered color scheme), <https://m2.material.io/design/color/dark-theme.html#ui-application>
- [x] Profile menu in navbar (<https://fr.freepik.com/vecteurs-premium/slider-jour-nuit_44129227.htm#from_element=cross_selling__vector> <https://fr.freepik.com/vecteurs-premium/bouton-vectoriel-interrupteur-bascule-mode-nuit-jour-luminosite-du-theme-application-element-option-diapositive-clair-sombre_28183375.htm>)
- [x] Fix create button (position, add checkmark and animation)
- [x] Add dark mode to components (_create_, _edit_, _explore_, _home_, _landing_, _library_, _cards_, _login_, _navbar_, _404_, _notifications_, _profile_, _description_, _question_, _recap_, _score_, _waiting_, _register_, _sidebar_, _tag-list_, _invite_)
- [x] Toggle sidebar when clicking inside
- [x] Add notifications where needed (<https://codeseven.github.io/toastr/demo.html>)
- [x] Add a loading spinner when waiting for API calls (Full screen pop-ups for call waits <https://sweetalert2.github.io/>)
  - [x] Add the spinner everywhere
- [x] Fix don't show error notif on landing page for /profile, /friends etc
- [x] Fix duplicate notif on call error
- [ ] edit question time with slider 
- [ ] Quiz editing
- [ ] Recents
- [ ] Quiz descriptions
- [ ] Profile/quiz pictures
- [ ] Visit other user profiles & profile on hover

### P3
- [ ] UI Improvements
  - [ ] Make the style consistent between pages (follow the one from notifications maybe)
  - [ ] Tailwind components: <https://www.material-tailwind.com/blocks>, <https://flowbite.com/#components>, <https://merakiui.com/components>, <https://daisyui.com/resources/videos/fast-beautiful-uis-angular-daisyui-x5l6lsj6ekw/>, <https://tailwindflex.com/tag/navbar?is_responsive=true>, <https://windytoolbox.com/>, <https://mobbin.com/explore/web>, <https://demos.creative-tim.com/soft-ui-design-system/presentation.html>, <https://lbegey.fr/templates-tailwind.html>, <https://github.com/ionic-team/ionic-framework/tree/main/core/src/components>
  - [ ] Icons: <https://icons8.com/icons/set/health--style-material>, <https://ionic.io/ionicons>, <https://fonts.google.com/icons>, <https://phosphoricons.com/>, <https://isocons.app>, <https://heroicons.com/>, <https://iconscout.com/>, <https://remixicon.com/>, <https://iconboddy.com>
  - [ ] Colors: <https://www.iamsajid.com/ui-colors/>
  - [ ] Menu: Componetize, <https://tailwindcss.com/plus/ui-blocks/marketing/elements/flyout-menus>, <https://snipzy.dev/snippets/liquid-glass-nav.html>, <https://forum.bubble.io/t/creating-a-three-state-toggle-slider-switch-button/310817>
  - [ ] Tooltips (use group on related button and group-hover to show tooltip)
  - [ ] Improve 404 (<https://tailwindcss.com/plus/ui-blocks/marketing/feedback/404-pages>)
  - [ ] custom radio button component
- [ ] Add OAuth using Supabase
- [ ] Friends
- [x] Badge for notifications
- [ ] Search/sort by tags
- [ ] Rating system
- [ ] Quizz error reporting like duolingo
- [x] Action when quiz-recap finish is triggered to go back to previous seen page
- [x] Number of remaining player in waiting page

### P4
- [ ] Page transitions
- [ ] Animations (gsap, <https://animejs.com/documentation/stagger>)
- [ ] Random quizz by theme
- [ ] ChatGPT integration
- [ ] Sounds
- [ ] Use Swl2 for modal inputs etc ?





&nbsp;  
&nbsp;  
&nbsp;  
## Dev
### P1
- [ ] Release plan (<https://excalidraw.com/> ?)
- [ ] Switch from serverless to server for the backend ? (websockets, faster, session store etc)
- [x] Remove undefined from appStore
- [x] Github Pages deployment
- [x] Vercel + redis deployment, app works successfully fully
- [x] Wrap navbar + sidebar dans un composant
- [ ] SSR ?, hydration ?, prefetch ?
- [x] TODO fix issues if no selected quiz answer
- [ ] Validate
  - [ ] API ouput
  - [ ] Frontend input
  - [ ] inputs in Backend
- [ ] Use only specific components (buttons, toggles, search bar, pop-up, menu, radio buttons, notifs, input with notifs etc, ...)
  - For instance use a title component like `<h1 class="text-2xl text-text-main dark:text-text-main">{{ quiz.nom }}</h1>`

### P2
- [ ] Vercel use deploy branch and not main, avoid deployments of not working stuff and unvalidated
- [ ] Create a migration to use Supabase locally
- [x] Remove CSS files
- [x] Remove all nulls
- [ ] Close websocket connection on logout, change page etc
- [x] Use pipe(takeUntil(this.destroy$)) to avoid memory leaks on subscriptions
- [ ] Use only css variables for colors
- [ ] Order tailwind classes (luke display > position > ... > hover > focus)
- [ ] CI/CD Tests
- [x] fix reload going to localhost:4200 instead of /home (when not logged in or logged in and on quizz-question for instance)
- [ ] bun instead of node

### P3
- [ ] Use search API + search service
- [ ] Only use constructor for declaration, do everything in ngOnInit
- [ ] Home-card component (or just card component for that + library)

### P4
- [ ] Use SwPush for notifications on desktop and mobile
- [x] Switch to supabase realtime for websockets
- [ ] ionic angular <https://github.com/ionic-team/ionic-framework/tree/main/core/src/components> +PWA


https://github.com/Chainlift/liftkit
https://ui.aceternity.com/components/3d-card-effect
https://www.spartan.ng/components/dropdown-menu
