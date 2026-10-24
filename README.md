# Finance Auditor (private, Firebase + Render)

Live ledger for a class fund (and any other funds) with real-time totals, audit flags,
Excel import/export, and a file auditor. Only you can sign in.

## 1. Firebase (database)
1. Go to https://console.firebase.google.com -> Add project.
2. Build -> Firestore Database -> Create database -> Production mode -> pick a region.
3. Project settings (gear) -> Service accounts -> Generate new private key.
   A .json file downloads. KEEP IT SECRET - never upload it to GitHub.

## 2. GitHub
1. Create a new **private** repository.
2. Upload every file in this folder (app.py, storage.py, templates/, requirements.txt,
   render.yaml, .python-version, .gitignore, README.md). Do NOT upload the Firebase .json key.

## 3. Render
1. https://dashboard.render.com -> New -> Blueprint -> pick your repo (uses render.yaml).
   (Or New -> Web Service: Build `pip install -r requirements.txt`, Start `gunicorn app:app --workers 1 --threads 4`.)
2. Fill in the environment variables:
   - APP_USERNAME : your login name
   - APP_PASSWORD : a strong password
   - FIREBASE_CREDENTIALS : open the Firebase .json key in Notepad, copy EVERYTHING, paste it here
   - SECRET_KEY : auto-generated (if not, type any long random text)
3. Deploy. Open your .onrender.com link and sign in.

Free Render plans sleep after ~15 min idle; the first visit then takes ~30-60 s.

## Run on your computer
    python -m pip install --upgrade pip
    pip install --only-binary=:all: -r requirements.txt
    python app.py        # http://localhost:5000  (login admin / admin)
Without FIREBASE_CREDENTIALS it saves to local_db.json instead of Firebase.
