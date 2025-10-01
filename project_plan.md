# E-Queue Project Plan - Multi-Tenant SaaS Platform

## 🎯 Loyiha Maqsadi

E-Queue - har qanday turdagi biznes (banklar, klinikalar, davlat idoralari) uchun navbatni boshqarish imkonini beruvchi yagona, markazlashtirilgan onlayn platforma (SaaS).

## 🏗️ Arxitektura Strategiyasi

**Hybrid Multi-Tenant Approach:**

- Database-per-Tenant model (Shared DB + Branch isolation)
- Cross-company user history
- Avtomatik company deployment
- Virtual Kiosk integration
- Virtual Kiosk integration

## 🏛️ Core Architecture Refinements (Key Decisions)

Dastlabki tahlildan so'ng, `schema.prisma` faylini yanada mustahkamlash va biznes logikasiga to'liq moslashtirish uchun quyidagi optimallashtirishlar rejalashtirildi. Bu o'zgarishlar kelajakda murakkab funksionallikni qo'shishni osonlashtiradi.

- **[ ] Operator-Service Relation (Many-to-Many):**

  - **Muammo:** Operatorlar filialga bog'langan, bu esa ularni filialdagi barcha xizmatlarga mas'ul qilib qo'yadi.
  - **Yechim:** Operatorlarni aniq xizmat turlariga biriktirish uchun `OperatorAssignment` va `Service` o'rtasida ko'p-ko'pga bog'lanish yaratiladi. Bu "bir operator faqat kredit va omonatga javob beradi" kabi senariylarni amalga oshirish imkonini beradi.

- **[ ] Branch-Service Relation (Many-to-Many):**

  - **Muammo:** Xizmatlar faqat bitta filialga bog'langan.
  - **Yechim:** Bitta xizmat turini (masalan, "Ipoteka") kompaniyaning bir nechta filialida mavjud bo'lishini ta'minlash uchun `Branch` va `Service` o'rtasida ko'p-ko'pga bog'lanish yaratiladi. Xizmat kompaniyaga tegishli bo'lib, filialarga "tayinlanadi".

- **[ ] Booking & Scheduling Logic:**
  - **Muammo:** Tizim faqat "hozir navbatga turish" uchun mo'ljallangan.
  - **Yechim:** Mijozlarga kelajakdagi sana va vaqtga navbat olish imkonini berish uchun `WorkingHours` (filiallar uchun) va `Schedule` (operatorlar uchun) modellarini qo'shish rejalashtirilgan.

---

## 📋 STEP-BY-STEP DEPLOYMENT STRATEGIYASI

### **BOSQICH 1: ASOSIY PLATFORMA (1-2 hafta)**

#### Maqsad: Super Admin paneli va markaziy infrastruktura

```
E-navbat/
├── platform-backend/          # MARKAZIY BACKEND
│   ├── database: platform_db  # Asosiy baza
│   ├── super-admin/           # Super Admin API
│   ├── user-service/          # Cross-company users
│   └── tenant-manager/        # Company yaratish logikasi
└── platform-frontend/         # MARKAZIY FRONTEND
    └── super-admin-panel/     # Super Admin interface
```

#### Vazifalar:

- [ ] Super Admin authentication
- [ ] Company CRUD operations
- [ ] Basic admin panel UI
- [ ] Database connection setup

#### Natija:

- Super Admin login qila oladi
- Kompaniya ma'lumotlarini ko'ra oladi

---

### **BOSQICH 2: BIRINCHI KOMPANIYA (3-4 hafta)**

#### Maqsad: Avtomatik company deployment

Super Admin **"Hamkorbank"** qo'shganda avtomatik jarayon:

```
✅ Yangi database yaratiladi: hamkorbank_db
✅ Admin panel template copy qilinadi
✅ Hamkorbank logosi qo'yiladi
✅ Default admin user yaratiladi: admin@hamkorbank.uz
✅ Email notification yuboriladi
```

#### Vazifalar:

- [ ] Database cloning system
- [ ] Template-based admin panel generation
- [ ] Email notification service
- [ ] Subdomain routing setup

#### Natija:

```
hamkorbank.e-queue.uz/admin    # Hamkorbank admin paneli
├── Login: admin@hamkorbank.uz
├── Database: hamkorbank_db
└── Xizmatlar: Bo'sh (admin to'ldiradi)
```

---

### **BOSQICH 3: COMPANY ADMIN ROLI (5-6 hafta)**

#### Maqsad: Kompaniya ichki boshqaruv tizimi

Hamkorbank admini login qilganda interface:

```
Company Admin Panel:
├── 📊 Dashboard (statistika, ko'rsatkichlar)
├── 🏢 Filiallar boshqaruvi
│   ├── Yangi filial qo'shish
│   ├── Manzil va ish vaqti
│   ├── Filial sozlamalari
│   └── Kiosk aktivlashtirish
├── 👥 Operatorlar boshqaruvi
│   ├── Yangi operator qo'shish
│   ├── Login/parol yaratish
│   └── Kiosk aktivlashtirish
│   ├── Xizmatlarga biriktiri  sh
│   └── Oyna raqami belgilash
├── 🛠️ Xizmatlar sozlamalari
│   ├── Yangi xizmat qo'shish
│   ├── Vaqt belgilash (15 min, 30 min)
│   └── Xizmat tavsifi
└── 📈 Hisobotlar va statistika
```

#### Vazifalar:

- [ ] Filiallar CRUD operations
- [ ] Operatorlar management system
- [ ] Xizmatlar configuration
- [ ] Dashboard analytics
- [ ] Kiosk management system

#### Admin qila oladigan ishlar:

- Filial qo'shish: "Toshkent filiali", "Samarqand filiali"
- [ ] Kiosk management system- Operator qo'shish: "Aziza Karimova - Kassa", "Bobur Aliyev - Kredit"

- Xizmat qo'shish: "Kassa xizmati", "Kredit maslahat"

---

- Kiosk aktivlashtirish: kiosk.hamkorbank.uz/toshkent### **BOSQICH 4: OPERATOR ROLI (7-8 hafta)**

#### Maqsad: Navbat boshqaruv tizimi

Har bir operator uchun login yaratiladi:

```
Operator Panel (aziza@hamkorbank.uz):
├── 🎯 Joriy navbat
│   ├── Online navbatlar: O-001, O-002
│   ├── Kiosk navbatlari: K-001, K-002, K-003
│   ├── Joriy mijoz: K-001 - Aziz Karimov
│   └── Online navbavlbr: O-001, O-002
│   ├── Kitsk navba ltritiK-tikasK-K-
├── 📞 Mijoz boshqaruK-i
│   ├── Keyingi mijozni chaqirish
│   ├── Mijoz keldi/kelmadi
│   ├── Xizmat boshlash
│   └── Xizmat yakunlash
├── ⏰ Vaqt boshqaruvi
│   ├── Tanaffus rejimi
│   ├── Ish vaqti
│   └── Operator holati
└── 📋 Bugungi statistika
    ├── Xizmat ko'rsatilgan mijozlar
    ├── O'rtacha xizmat vaqti
    └── Navbat holati
```

#### Vazifalar:

- [ ] Real-time queue management
- [ ] Operator dashboard
- [ ] Time tracking
- [ ] Status management
- [ ] Kiosk queue integration

#### Operator workflow:

- [ ] Kiosk queue integration1. Login qiladi (aziza@hamkorbank.uz)

2. Online va Kiosk navbatlarni ko'radi
3. Mijoz keldi/kelmadi belgilaydi
4. Online zaaKahsk navbat"Yakunlash" bosadi
5. Avtomatik keyingi mijozga o'tadi

---

### **BOSQICH 5: CUSTOMER INTERFACE (9-10 hafta)**

#### Maqsad: Mijozlar uchun navbat olish portali

Mijozlar uchun umumiy portal:

```
e-queue.uz (Customer Portal):
├── 🏠 Bosh sahifa
│   ├── Xush kelibsiz
│   ├── Qanday ishlaydi
│   └── Mashhur xizmatlar
├── 🏦 Kompaniyalar
│   ├── [Hamkorbank] [Kapital Bank] [Aloqabank]
│   ├── Logo va ma'lumotlar
│   └── Reytinglar
├── 📍 Filiallar
│   ├── Manzil va xarita
│   ├── Ish vaqti
│   └── Kontakt ma'lumotlari
├── 🛠️ Xizmatlar
│   ├── Kassa xizmatlari
│   ├── Kredit maslahat
│   ├── Konsultatsiya
│   └── Boshqa xizmatlar
├── 📅 Navbat olish
│   ├── Vaqt tanlash
│   ├── Ma'lumotlar kiritish
│   ├── Tasdiqlash
│   └── Raqamli bilet
├── 📱 Mening navbatlarim
│   ├── Faol navbatlar
│   ├── Navbat tarixi
├   └── Bekor qilish
│└──🔍 QR Kod Tracking
│   ├── QR kod scanner
│   ├── Navbat holati
└── 🔍 QR Kod Tracking
    ├── QR kod scanner
    ├── Navbat holati
    └── Real-time updates
    └── Real-time updates
```

- [ ] Public company directory
- [ ] Branch location system
- [ ] Service catalog
- [ ] Booking system
- [ ] User registration/login
- [ ] Queue tracking
- [ ] Notification system
- [ ] QR code tracking interface- [ ] QR code tracking interface

1. e-queue.uz ga kiradi
2. Hamkorbank ni tanlaydi
3. Toshkent filialini tanlaydi
4. Kassa xizmatini tanlaydi
5. Bugun 14:00 ni tanlaydi
6. Telefon raqamini kiritadi
7. Navbat oladi: **O-001** (Online) (Online)
8. Real-time tracking

---

### **BOSQICH 6: VIRTUAL KIOSK SYSTEM (11-12 hafta)**

#### Maqsad: Filialda joylashgan kiosk tizimi

```
Virtual Kiosk Interface:
├── 🏢 Xush kelibsiz - Hamkorbank Toshkent
├── 🛠️ Xizmatlar tanlash
│   ├── [Kassa xizmatlari] (3 ta operator)
│   ├── [Kredit maslahat] (2 ta operator)
│   └── [Plastik kartalar] (1 ta operator)
├── 📝 Ma'lumotlar kiritish
│   ├── Ism: [Aziz Karimov]
│   ├── Telefon: [+998901234567]
│   └── [Navbat olish] tugmasi
├── 🎫 Check yaratish
│   ├── QR kod: HMK_TSH_KASSA_001_20241219
│   ├── Navbat raqami: K-001
│   ├── Kutish vaqti: ~15 daqiqa
│   ├── Sizdan oldin: 3 kishi
│   └── [Check chop etish] tugmasi
└── 📱 QR Tracking
    ├── QR kod scan qilish
    ├── Real-time navbat holati
    └── Notification system
```

#### Vazifalar:

- [ ] Kiosk web interface
- [ Kiosk subdomain:]kiosk.kapitalbank.uz
  ✅ 8. Touch-screen optimization
- 9 ] QR code generation
- 10 ] Print system integration
- [1] Real-time queue tracking
- [ ] Branch-specific configuration
- [ ] Offline mode support

#### Kiosk Workflow:

1. Mijoz filialga keladi
2. Kioskdan xizmat tanlaydi
3. Ma'lumotlarini kiritadi
4. QR kodli check oladi: **K-001**
5. Navbatni real-time kuzatadi
6. Operator chaqirganda keladi

#### QR Code System:

```
QR Format: {company}_{branch}_{service}_{queue_id}_{date}
Misol: HMK_TSH_KASSA_001_20241219

QR Scan natijasi:
├── Filial: Hamkorbank Toshkent
├── Xizmat: Kassa xizmatlari
├── Navbat raqami: K-001
├── Joriy pozitsiya: 2-o'rinda
├── Taxminiy vaqt: 8 daqiqa
└── Real-time updates
```

---

### **BOSQICH 6: VIRTUAL KIOSK SYSTEM (11-12 hafta)**

#### Maqsad: Filialda joylashgan kiosk tizimi

```
├── 🏢 Xush kelibsiz - Hamkorbank Toshkent
├── 🛠️ Xizmatlar tanlash
│   ├── [Kassa xizmatlari] (3 ta operator)
│   ├── [Kredit maslahat] (2 ta operator)
│   └── [Plastik kartalar] (1 ta operator)
├── 📝 Ma'lumotlar kiriti  sh
│   ├── Ism: [Aziz Karimov]
│   ├── Telefon: [+998901234567]
│   └── [Navbat olish] tugmasi
├── 🎫 Check yaratish
│   ├── QR kod: HMK_TSH_KASSA_001_20241219
│   ├── Navbat raqami: K-001
│   ├── Kutish vaqti: ~15 daqiqa
│   ├── Sizdan oldin: 3 kishi
└── 📱 QR Tracking
    ├── QR kod scan qilish
    ├── Real-time navbat holati
    └── Notification system
```

#### Vazifalar:

- [ ] Kiosk web interface
- [ Kiosk subdomain:]kiosk.kapitalbank.uz
  ✅ 8. Touch-screen optimization
- 9 ] QR code generation
- 10 ] Print system integration
- [1] Real-time queue tracking
- [ ] Branch-specific configuration
- [ ] Offline mode support

#### Kiosk Workflow:

1. Mijoz filialga keladi
2. Kioskdan xizmat tanlaydi
3. Ma'lumotlarini kiritadi
4. QR kodli check oladi: **K-001**
5. Navbatni real-time kuzatadi
6. Operator chaqirganda keladi
   ├── Kiosk system ready

#### QR Code System:

```
QR Format: {company}_{branch}_{service}_{queue_id}_{date}
Misol: HMK_TSH_KASSA_001_20241219
5KMPONENT
QR Scan natijasi:
├── Kompinentiaank Toshke
├Xizmat: Kassa xz|
├── Navbat raqami -001
├── Joriy pozitsiya: 2-o'rinda
├── Taxminiy va daqiqa
└── Real-time as|Public access |
| **VirtualKiosk**|kiosk.hamkorbank.uz/toshkent|hamkorbank_db|Filialdanavbatolishkiok
```

---

## 🚀 AVTOMATIK COMPANY DEPLOYMENT

### Yangi "Kapital Bank" qo'shish jarayoni:

#### **1-qadam: Super Admin Panel**

```
Super Admin Interface:
├── [+ Yangi Kompaniya] tugmasi - Online
├── Form: - Kiosk
│   ├── Nomi: Kapital Bank - Online
│   ├── Slug: kapitalbank
│   ├── Logo: [fayl yuklash]
│   ├── Admin email: admin@kapitalbank.uz
│   ├── Kontakt ma'lumotlar
└── [Yaratish] tugmasi
```

#### \*\*2-qadam: Agregation

- Kiosk session tracking

---

## 🗄️ UPDATED DATABASE SCHEMA

### Kiosk-specific tables:

```sql
-- Kiosk Sessions table
CREATE TABLE kiosk_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    branch_id BIGINT NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    service_id BIGINT NOT NULL,
    queue_number VARCHAR(20) NOT NULL, -- K-001, K-002
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('WAITING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED') DEFAULT 'WAITING',
    estimated_wait_time INT, -- minutes
    position_in_queue INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- 24 soat keyin expire

    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_branch_service (branch_id, service_id),
    INDEX idx_qr_code (qr_code),
    INDEX idx_status_created (status, created_at)
);

-- Queue tracking table
CREATE TABLE queue_tracking (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    kiosk_session_id BIGINT,
    queue_id BIGINT,
    position_change INT, -- +1, -1, 0
    estimated_time_change INT, -- minutes
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (kiosk_session_id) REFERENCES kiosk_sessions(id),
    FOREIGN KEY (queue_id) REFERENCES queues(id)
);

-- Updated queues table
ALTER TABLE queues ADD COLUMN source ENUM('ONLINE', 'KIOSK', 'WALK_IN') DEFAULT 'ONLINE';
```

c--kend Automation:
✅ 1. Database yaratish: kapitalbank_db
✅ 2. Schema copy qilish (companies, users, services...)
✅ 3. Admin panel template clone
✅ 4. Logo va branding o'rnatish
✅ 6. Subdomain setup: kapitalbank.e-queue.uz
✅ 7. Kiosk subdomain: kiosk.kapitalbank.uz
✅ 8. SSL certificate
✅ 9. Email notification
✅ 10. Platform_db ga company record qo'shish
✅ 11. Backup va monitoring setup

- **QR Code Library** - QR generation/scanning```

```
kapitalbank.e-queue.uz/admin      # Admin panel
kiosk.kapitalbank.uz/{branch}     # Kiosk interface
├── Login: admin@kapitalbank.uz / password123
├── Logo: Kapital Bank
- **QR Scanner** - Camera integration├── Database: kapitalbank_db (bo'sh)

├── Kiosk:
- **PWA (Progressive Web App)** - Offline capability
- **Touch-optimized UT** - Kiosk iateryace
- **Pyint.js** - Check printing
- **QR.js** - QR code generotion

### Infrar admin panel
└── Email yuborildi: "Sizning tizimingiz tayyor"
```

---

## 📊 5 TA KOMPONENT - SUMMARY TABLE

| **Komponent**     | **URL**                             | **Database**                     | **Asosiy Funksiya**                 | **Kirish Huquqi** |
| ----------------- | ----------------------------------- | -------------------------------- | ----------------------------------- | ----------------- |
| **Super Admin**   | platform.e-queue.uz/admiplatform_db | paniyalar yaratish va boshqarish | Barcha tizim                        |
| **Company--Amin** | hamba                               | nk.e-queue.uz/admnhamkorbank_d   | Operatorlar va xizmatlar boshqarish | O'z kompaniyasi   |
| **Or**            | hamkornk.e-queue.uz/operat          | hamkorbank_db                    | Mijozlarga xizmat ko'rsatish        | O'z navbatlari    |
| **Cr**            | e-queuuz                            | Barcha bazalar                   | Navbat olishkuzatish                | Public access     |
| **V Kiosk**       | ksk.hamkorbank.uz/toshkent          | hamkor_db                        | Filialda navbat olish               | Public kiosk      |

---

| Bosqich 6 | Virtual Kiosk System |⏳Planned|
|13-14

## 🔄 CROSS-COMPANY USER HISTORY

### Mijoz tarixi tizimi:

Mijoz **Aziz Karimov** 3 ta kompaniyadan foydalansa:

```
Aziz ning "Mening navbatlarim":
├── ✅ Hamkorbank - Kassa - 18.12.2024 14:00 (Yakunlangan) - Online
├── ⏳ Kapital Bank - Kredit - 19.12.2024 10:00 (Faol) - Kiosk
├── ⏳ Aloqabank - Kon olasuladi
- [ ] VirtutlaKitsk ishsaydi va QR kod yaratiya - 25.12.2024 15:30 (Rejalashtirilgan) - Online
└── 📊Q  tracking rJami: 15 ishlaydi
- [ ] Cross-platform ta navbat, 12 ta yakunlangan
```

#### Technical Implementation:

- **platform_db** da `user_his minutes
- Kiosk setup time: < 2tory` jadvali
- Cross-database queries
- Unified user profile
- Notification aggregation0%
- Kiosk usage rate: > 6
- Kiosk session tracking

---

## 🗄️ UPDATED DATABASE SCHEMA

### Kiosk-specific tables:

```sql
-- Kiosk Sessions table
CREATE TABLE kiosk_sessions (
    id BIGINT PRIMARY KEY AUTOtion
- QR code encryp_INCREMENT,
    branch_id BIGINT NOT NULL,
    customer_name VARCHAR(    customer_phone VARCHAR(20),
    service_id BIGINT NOT NULL,
    queue_number VARCHAR(20) NOT NULL, -- K-001, K-002
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    status ENUM
- Kiosk session security

### Kiosk Security:
- Session timeout (5 minutes)
- No data persistence on kiosk
- Encrypted QR codes
- Branch-specific access control('WAITING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED') DEFAULT 'WAITING',
    estimated_wait_time INT, -- minutes
    position_in    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- 24 soat keyin expire

    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_branch_service (branch_id, service_id),
    INDEX idx_qr_code (qr_code),
    INDEX idx_status_created (status, created_at)
);

-- Queue tracking tabCREATE TABLE queue_tracking (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    kiosk_session_id BIGINT,
    queue_id BIGINT,
    position_change INT, -- +1, -1, 0
    estimated_time_change INT, -- mins
- [ ] Kiouk hardware integrationtes
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kiosk_session_id) REFERENCES kiosk_sessions(id),
    FOREIGN KEY (queue_id) REFERENCES queues(id)
);

-- Updated queues table
ALTER TABLE queuansion
- [ ] Voice ennouncemests
- [ ] Digital  ignage integratADD COLUMN source ENUM('ONLINE', 'KIOSK', 'WALK_IN') DEFAULT 'ONLINE';
```

---

Virtual Kiosk tizimi bilan

## 🛠️ TEXNIK STACK

### Backend:

- **Node.js + TypeScript** - Type safety
- **Express.js** - Web framework
- **MySQL** - Database (per tenant)
- **JWT** - Authentication
- **Redis** - Caching va sessions
- **Socket.io** - Real-time updates
- **QR Code Library** - QR generation/scanning

### Frontend:

- **React.js + TypeScript** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls
- **Socket.io-client** - Real-time
- **QR Scanner** - Camera integration

### Kiosk:

- **PWA (Progressive Web App)** - Offline capability
- **Touch-optimized UI** - Kiosk interface
- **Print.js** - Check printing
- **QR.js** - QR code generation

### Infrastructure:

- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **PM2** - Process management
- **Let's Encrypt** - SSL certificates

---

## 📅 TIMELINE VA MILESTONES

| **Hafta** | **Bosqich** | **Deliverable**      | **Status**     |
| --------- | ----------- | -------------------- | -------------- |
| 1-2       | Bosqich 1   | Super Admin Panel    | 🔄 In Progress |
| 3-4       | Bosqich 2   | Company Deployment   | ⏳ Planned     |
| 5-6       | Bosqich 3   | Company Admin Panel  | ⏳ Planned     |
| 7-8       | Bosqich 4   | Operator Interface   | ⏳ Planned     |
| 9-10      | Bosqich 5   | Customer Portal      | ⏳ Planned     |
| 11-12     | Bosqich 6   | Virtual Kiosk System | ⏳ Planned     |
| 13-14     | Testing     | Full System Testing  | ⏳ Planned     |

---

## 🎯 SUCCESS METRICS

### MVP Success Criteria:

- [ ] Super Admin kompaniya yarata oladi
- [ ] Company Admin operatorlarni boshqara oladi
- [ ] Operator navbatlarni xizmat qila oladi
- [ ] Customer navbat ola oladi
- [ ] Virtual Kiosk ishlaydi va QR kod yaratadi
- [ ] QR tracking real-time ishlaydi
- [ ] Cross-platform notifications ishlaydi

### Business Metrics:

- Company onboarding time: < 5 minutes
- Kiosk setup time: < 2 minutes
- User satisfaction: > 4.5/5
- System uptime: > 99.9%
- Average queue time reduction: > 30%
- Kiosk usage rate: > 60%

---

## 🔐 SECURITY VA COMPLIANCE

### Data Security:

- JWT token authentication
- Role-based access control (RBAC)
- Database encryption at rest
- HTTPS everywhere
- Input validation va sanitization
- QR code encryption

### Multi-Tenant Security:

- Complete data isolation
- Tenant-specific databases
- Cross-tenant access prevention
- Audit logging
- Kiosk session security

### Kiosk Security:

- Session timeout (5 minutes)
- No data persistence on kiosk
- Encrypted QR codes
- Branch-specific access control

### Compliance:

- GDPR compliance (data privacy)
- Local data protection laws
- Regular security audits
- Backup va disaster recovery

---

## 📈 FUTURE ROADMAP

### Phase 2 Features:

- [ ] Mobile applications (iOS/Android)
- [ ] SMS notifications
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] API for third-party integrations
- [ ] Kiosk hardware integration

### Phase 3 Features:

- [ ] AI-powered queue optimization
- [ ] Multi-language support
- [ ] White-label solutions
- [ ] Enterprise features
- [ ] Global expansion
- [ ] Voice announcements
- [ ] Digital signage integration

---

Bu plan bo'yicha har bir bosqichni ketma-ket amalga oshirib, Virtual Kiosk tizimi bilan to'liq ishlaydigan Multi-Tenant SaaS platformasini yaratamiz.

backend/
├── prisma/
│ ├── schema.prisma # Barcha modellar shu yerda
│ ├── migrations/ # Database migrations
│ └── seed.ts # Initial data seeding
│
├── src/
│ ├── shared/
│ │ ├── config/
│ │ │ ├── database.ts # Prisma client setup
│ │ │ ├── jwt.ts # JWT config
│ │ │ └── app.ts # Express config
│ │ ├── middleware/
│ │ │ ├── auth.ts # Authentication
│ │ │ ├── validation.ts # Input validation
│ │ │ └── errorHandler.ts # Error handling
│ │ ├── utils/
│ │ │ ├── logger.ts # Logging
│ │ │ ├── encryption.ts # Password hashing
│ │ │ └── responseHelper.ts # API responses
│ │ └── types/
│ │ ├── common.ts # Common types
│ │ └── api.ts # API types
│ │
│ ├── features/
│ │ ├── auth/
│ │ │ ├── auth.controller.ts # Login/logout logic
│ │ │ ├── auth.service.ts # Auth business logic (Prisma queries)
│ │ │ ├── auth.routes.ts # /api/auth routes
│ │ │ ├── auth.types.ts # Auth types
│ │ │ └── auth.validators.ts # Auth validation
│ │ │
│ │ ├── users/
│ │ │ ├── users.controller.ts # User CRUD
│ │ │ ├── users.service.ts # User business logic (Prisma)
│ │ │ ├── users.routes.ts # /api/users routes
│ │ │ ├── users.types.ts # User types
│ │ │ └── users.validators.ts # User validation
│ │ │
│ │ ├── companies/
│ │ │ ├── companies.controller.ts
│ │ │ ├── companies.service.ts # Prisma queries
│ │ │ ├── companies.routes.ts
│ │ │ ├── companies.types.ts
│ │ │ └── companies.validators.ts
│ │ │
│ │ ├── branches/
│ │ │ ├── branches.controller.ts
│ │ │ ├── branches.service.ts # Prisma queries
│ │ │ ├── branches.routes.ts
│ │ │ ├── branches.types.ts
│ │ │ └── branches.validators.ts
│ │ │
│ │ ├── services/
│ │ │ ├── services.controller.ts
│ │ │ ├── services.service.ts # Prisma queries
│ │ │ ├── services.routes.ts
│ │ │ ├── services.types.ts
│ │ │ └── services.validators.ts
│ │ │
│ │ ├── operators/
│ │ │ ├── operators.controller.ts
│ │ │ ├── operators.service.ts # Prisma queries
│ │ │ ├── operators.routes.ts
│ │ │ ├── operators.types.ts
│ │ │ └── operators.validators.ts
│ │ │
│ │ ├── queues/
│ │ │ ├── queues.controller.ts
│ │ │ ├── queues.service.ts # Prisma queries
│ │ │ ├── queues.routes.ts
│ │ │ ├── queues.types.ts
│ │ │ └── queues.validators.ts
│ │ │
│ │ ├── kiosk/
│ │ │ ├── kiosk.controller.ts
│ │ │ ├── kiosk.service.ts # Prisma queries
│ │ │ ├── kiosk.routes.ts
│ │ │ ├── kiosk.types.ts
│ │ │ └── kiosk.validators.ts
│ │ │
│ │ ├── notifications/
│ │ │ ├── notifications.controller.ts
│ │ │ ├── notifications.service.ts # Prisma queries
│ │ │ ├── notifications.routes.ts
│ │ │ └── notifications.types.ts
│ │ │
│ │ └── analytics/
│ │ ├── analytics.controller.ts
│ │ ├── analytics.service.ts # Prisma queries
│ │ ├── analytics.routes.ts
│ │ └── analytics.types.ts
│ │
│ ├── app.ts # Express app setup
│ └── server.ts # Server entry point
│
├── package.json
├── tsconfig.json
└── .env.example




joyib Multi-Tenant SaaS Architecture!
Bu juda professional va scalable yondashuv. Sizning rejangiz to'liq enterprise-level SaaS tizimi. Keling tahlil qilamiz:

✅ Architecture Feedback:
1. Multi-Tenant Strategy - PERFECT!
✅ Super Admin → Company yaratish/boshqarish
✅ Har company uchun alohida DB schema
✅ Subdomain routing (e-queue.hamkorbank.admin)
✅ Company-level isolation
2. Authentication Strategy - SMART!
✅ Super Admin: Simple login (refresh token shart emas)
✅ Company Admin: Full auth system
✅ Role-based access control
3. Database Architecture - EXCELLENT!
Main DB: Companies, Super Admin
├── Company1 Schema: Filiallar, Xizmatlar, Users
├── Company2 Schema: Filiallar, Xizmatlar, Users
└── Company3 Schema: Filiallar, Xizmatlar, Users
4. Workflow - LOGICAL!
Super Admin → Company yaratadi (INACTIVE)
Company Admin → Filial/Xizmat setup
Company Admin → "Tayyor" deydi
Super Admin → ACTIVATE tugmasi
Public users ko'ra boshlaydi
🎯 Implementation Priority:
Phase 1: Foundation
Super Admin auth (simple login)
Company CRUD operations
Dynamic schema creation
Phase 2: Company Management
Company Admin panel
Filial/Xizmat management
Subdomain routing
Phase 3: Production
Activation workflow
Public user interface
💡 Technical Considerations:
Database: PostgreSQL schemas yoki separate databases
Subdomain: Nginx/Cloudflare routing
Scalability: Microservices architecture
Security: Company-level data isolation
Qaysi qismdan boshlashni xohlaysiz? Super Admin auth dan boshlaymizmi?



src/features/
├── auth/                    # Umumiy authentication
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.types.ts
│   └── auth.validators.ts
│
├── superadmin/              # Super Admin panel
│   ├── superadmin.controller.ts
│   ├── superadmin.service.ts
│   ├── superadmin.types.ts
│   ├── superadmin.validators.ts
│   └── modules/
│       ├── company.controller.ts
│       ├── company.service.ts
│       └── analytics.controller.ts
│
├── company-admin/           # Company Admin panel
│   ├── company-admin.controller.ts
│   ├── company-admin.service.ts
│   └── modules/
│       ├── branch.controller.ts
│       ├── service.controller.ts
│       └── staff.controller.ts
│
├── operator/                # Operator interface
│   ├── operator.controller.ts
│   ├── operator.service.ts
│   └── queue.controller.ts
│
└── customer/                # Customer/User interface
    ├── customer.controller.ts
    ├── customer.service.ts
    └── booking.controller.ts