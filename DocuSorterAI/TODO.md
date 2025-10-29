# DocuSorter AI Implementation TODO

## Phase 1: Project Setup
- [x] Create project directory structure
- [x] Create requirements.txt with all dependencies
- [x] Create README.md with instructions

## Phase 2: Data Preprocessing (Fáze 1)
- [x] Create preprocess.py for text extraction from PDF/DOCX
- [x] Implement text cleaning pipeline (tokenization, stop-words, lemmatization)
- [ ] Create sample training dataset (CSV with text and categories)

## Phase 3: ML Model Training (Fáze 2)
- [ ] Create train_model.py for TF-IDF vectorization and SVC training
- [ ] Implement model saving/loading with joblib
- [ ] Add prediction function with confidence scores

## Phase 4: Backend Development
- [ ] Create app.py with Flask routes:
  - [ ] / (home page)
  - [ ] /upload (file upload and classification)
  - [ ] /move (file moving with safety checks)
- [ ] Add error handling and logging

## Phase 5: Frontend Development (Fáze 3)
- [ ] Create static/index.html with Bootstrap UI
- [ ] Implement file upload form
- [ ] Create results table with edit dropdown and move button
- [ ] Add JavaScript for AJAX interactions

## Phase 6: Testing and Finalization
- [ ] Test text extraction from sample PDF/DOCX
- [ ] Train model on sample data
- [ ] Test full web app flow
- [ ] Create run.bat for easy startup
- [ ] Final README updates
