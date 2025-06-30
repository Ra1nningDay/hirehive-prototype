# EyeQcheck RAG Service - Work Assignment Documentation

## 📋 Project Overview

This document outlines the work assignment for 3 interns working on the EyeQcheck RAG (Retrieval-Augmented Generation) service. The project is divided into three main areas: data preprocessing, data quality validation, and vector database management.

---

## Tasks

### **(?): Data Preprocessing & Document Loading**

**หน้าที่**: ทำความสะอาดและเตรียมข้อมูลก่อนส่งไปทำ vectorization

**ไฟล์ที่รับผิดชอบ:**

```
rag-service/
├── app/
│   ├── core/
│   │   ├── document_loader.py     หลัก - โหลดและประมวลผลเอกสาร
│   │   └── config.py              config ส่วน document processing
│   └── utils/
│       ├── text_cleaner.py        สร้างใหม่ - ทำความสะอาดข้อความ
│       ├── file_processor.py      สร้างใหม่ - ประมวลผลไฟล์
│       └── data_validator.py      สร้างใหม่ - ตรวจสอบข้อมูล
```

**งานที่ทำ:**

1. **โหลดไฟล์จาก knowledge directory**

   - รองรับไฟล์ .txt, .md, .pdf
   - Handle encoding issues (UTF-8)
   - Error handling สำหรับไฟล์เสีย

2. **ทำความสะอาดข้อมูล (remove noise, normalize text)**

   - ลบ special characters ที่ไม่จำเป็น
   - Normalize whitespace และ line breaks
   - แปลงข้อความให้เป็นรูปแบบมาตรฐาน

3. **Text splitting และ chunking**

   - แบ่งข้อความเป็น chunks ขนาดเหมาะสม
   - รักษา context ระหว่าง chunks
   - Configurable chunk size และ overlap

4. **Validate data quality**

   - ตรวจสอบความครบถ้วนของข้อมูล
   - หา duplicates และ inconsistencies

5. **Export cleaned data สำหรับ vectorization**
   - Save ในรูปแบบที่ vector team ใช้ได้
   - Include metadata และ processing logs

**Deliverables:**

- [ ] `document_loader.py` - Document loading functionality
- [ ] `text_cleaner.py` - Text preprocessing utilities
- [ ] `file_processor.py` - File handling utilities
- [ ] `data_validator.py` - Basic data validation
- [ ] Clean dataset พร้อม metadata
- [ ] Processing pipeline documentation

---

### **(?): Data Quality & Schema Validation**

**หน้าที่**: ตรวจสอบคุณภาพข้อมูลและ schema validation

**ไฟล์ที่รับผิดชอบ:**

```
rag-service/
├── app/
│   ├── models/
│   │   ├── schemas.py              หลัก - Pydantic models
│   └── utils/
│       ├── data_quality.py         สร้างใหม่ - Quality metrics
│       ├── schema_validator.py     สร้างใหม่ - Schema validation
│       └── metadata_extractor.py   สร้างใหม่ - Metadata extraction
```

**งานที่ทำ:**

1. **สร้าง Pydantic models สำหรับ validation**

   - Document schema models
   - Request/Response models สำหรับ API
   - Configuration schemas

2. **ตรวจสอบ data quality (completeness, consistency)**

   - สร้าง quality metrics และ reports
   - ตรวจหา missing data หรือ anomalies
   - Validate data format และ structure

3. **Extract metadata จากเอกสาร**

   - Document properties (length, language, etc.)
   - Content analysis และ categorization
   - Statistical information

4. **สร้าง data pipeline validation**

   - Pipeline stages validation
   - Data flow integrity checks
   - Error detection และ reporting

5. **Report data quality metrics**
   - Dashboard สำหรับ monitoring data quality
   - Automated quality reports
   - Alert system สำหรับ quality issues

**Deliverables:**

- [ ] `schemas.py` - Complete Pydantic models
- [ ] `requests.py` & `responses.py` - API models
- [ ] `data_quality.py` - Quality assessment tools
- [ ] `schema_validator.py` - Validation utilities
- [ ] `metadata_extractor.py` - Metadata tools
- [ ] Quality assessment report
- [ ] Schema documentation

---

### **(?): Vector Database & Search**

**หน้าที่**: จัดการ vector database และ search functionality

**ไฟล์ที่รับผิดชอบ:**

```
rag-service/
├── app/
│   ├── core/
│   │   ├── vectorstore.py         หลัก - Vector database management
│   │   └── config.py              config ส่วน vectordb
│   ├── services/
│   │   └── retrieval.py           หลัก - Search functionality
│   └── utils/
│       ├── vector_utils.py        สร้างใหม่ - Vector utilities
│       ├── similarity_search.py   สร้างใหม่ - Search algorithms
│       └── index_manager.py       สร้างใหม่ - Index management
```

**งานที่ทำ:**

1. **รับข้อมูลที่ clean แล้วจาก A & B**

   - Interface กับ preprocessing pipeline
   - Data ingestion และ validation

2. **สร้าง embeddings และ vector index**

   - OpenAI embeddings integration
   - FAISS index creation และ management
   - Batch processing สำหรับ large datasets

3. **Implement search algorithms**

   - Semantic similarity search
   - Search result ranking และ filtering
   - Query optimization

4. **Optimize search performance**

   - Index optimization strategies
   - Caching mechanisms
   - Performance monitoring

5. **Monitor vector database health**
   - Health checks และ diagnostics
   - Performance metrics
   - Index maintenance tools

**Deliverables:**

- [ ] `vectorstore.py` - Complete vector database manager
- [ ] `retrieval.py` - Search service implementation
- [ ] `vector_utils.py` - Vector processing utilities
- [ ] `similarity_search.py` - Search algorithms
- [ ] `index_manager.py` - Index management tools
- [ ] Performance optimization report
- [ ] Search functionality documentation
