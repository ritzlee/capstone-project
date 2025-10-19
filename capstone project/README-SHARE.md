How to share this project and its browser data

Options provided in this folder:

1) package.ps1
   - Run this in PowerShell inside the project folder to create a zip file on your Desktop.
   - Usage: Open PowerShell in the project folder and run:
       .\package.ps1

2) export_localstorage.html
   - Open this file in Chrome on the source device, click Export, and save the downloaded JSON (capstone-localstorage.json).
   - This exports activities, users, and currentUser from localStorage.

3) import_localstorage.html
   - On the destination device, open this file in Chrome and choose the JSON file produced above.
   - It will write activities, users, and currentUser to localStorage so the other device has the same app data.

Notes:
- After importing localStorage data, reload the app pages (index.html, homepage.html, activity.html) to see the imported content.
- Keep the folder structure intact when sharing; assets/ must be transferred as well.
- For a long-term collaboration, consider using GitHub (recommended). This folder contains a PowerShell zip helper for quick sharing.
