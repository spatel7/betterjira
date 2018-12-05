# betterjira
Chrome extension that updates JIRA issue links to open in new tabs

### Step 1: Configure extension for your company
1. Clone this repository
2. Open up `manifest.json`, search for `COMPANY_DOMAIN`, and replace it with the domain your company uses for JIRA
3. Open up `jira.js`, search for `COMPANY_DOMAIN`, and set it to be same thing you chose in `manifest.json`

### Step 2: Load extension into Chrome
3. Open Chrome and go to your extensions by typing `chrome://extensions` into the URL
4. Enable developer mode (toggle in the top right corner of the page)
5. Select `Load unpacked` and load this repository from your files

### Step 3: Have fun
When this extension is enabled, any links on JIRA web pages that link to issues should open up in new tabs.

...it's lit 🔥