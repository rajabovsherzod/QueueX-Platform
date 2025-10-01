# E-Queue System Architecture

## 1. System Overview

E-Queue - Multi-Tenant SaaS navbat boshqaruv platformasi. Har bir kompaniya (tenant) o'zining alohida, xavfsiz ma'lumotlar hududiga ega.

## 2. User Roles va Permissions

### 2.1 Super Admin

- **Vazifalar:**
  - Yangi kompaniyalarni yaratish (Hamkorbank, Aloqabank)
  - Kompaniya ma'lumotlarini tahrirlash
  - Tizim sozlamalarini boshqarish
  - Barcha kompaniyalar statistikasini ko'rish

### 2.2 Company Admin

- **Vazifalar:**
  - O'z kompaniyasining filiallarini boshqarish
  - Operatorlarni qo'shish/olib tashlash
  - Xizmat turlarini sozlash
  - Kompaniya sozlamalarini o'zgartirish
  - Hisobotlarni ko'rish

### 2.3 Operator

- **Vazifalar:**
  - Navbatdagi mijozlarni ko'rish
  - Mijozni chaqirish va xizmat ko'rsatish
  - Navbat holatini yangilash
  - Keyingi mijozga o'tish

### 2.4 Customer (Mijoz)

- **Vazifalar:**
  - Kompaniya va filial tanlash
  - Xizmat turi tanlash
  - Navbat olish (online/offline)
  - Navbat holatini kuzatish

## 3. System Components

### 3.1 Super Admin Panel

```
┌─────────────────────────────────────┐
│           Super Admin Panel         │
├─────────────────────────────────────┤
│ • Kompaniyalar ro'yxati             │
│ • Yangi kompaniya qo'shish          │
│ • Kompaniya sozlamalari             │
│ • Tizim statistikasi                │
│ • Foydalanuvchilar boshqaruvi       │
└─────────────────────────────────────┘
```

### 3.2 Company Admin Panel (Scalable)

```
┌─────────────────────────────────────┐
│     [LOGO] Company Admin Panel      │
├─────────────────────────────────────┤
│ • Filiallar boshqaruvi              │
│ • Operatorlar boshqaruvi            │
│ • Xizmatlar sozlamalari             │
│ • Navbat statistikasi               │
│ • Sozlamalar                        │
└─────────────────────────────────────┘
```

### 3.3 Operator Panel

```
┌─────────────────────────────────────┐
│         Operator Dashboard          │
├─────────────────────────────────────┤
│ • Joriy navbat                      │
│ • Keyingi mijoz                     │
│ • Mijozni chaqirish                 │
│ • Xizmat yakunlash                  │
│ • Navbat tarixi                     │
└─────────────────────────────────────┘
```

### 3.4 Customer Interface

```
┌─────────────────────────────────────┐
│           E-Queue Portal            │
├─────────────────────────────────────┤
│ • Kompaniyalar ro'yxati             │
│ • Filiallar va manzillar            │
│ • Xizmat turlari                    │
│ • Vaqt tanlash                      │
│ • Navbat olish                      │
│ • Mening navbatlarim                │
└─────────────────────────────────────┘
```

### 3.5 Virtual Kiosk

```
┌─────────────────────────────────────┐
│           Virtual Kiosk             │
├─────────────────────────────────────┤
│ • Xizmat tanlash                    │
│ • Navbat olish                      │
│ • QR kod yaratish                   │
│ • Check chop etish                  │
└─────────────────────────────────────┘
```

## 4. User Flow Diagrammasi

### 4.1 Super Admin Flow

```
Super Admin Login
       ↓
Dashboard
       ↓
┌─────────────────┬─────────────────┬─────────────────┐
│ Kompaniya       │ Foydalanuvchi   │ Tizim           │
│ Yaratish        │ Boshqaruvi      │ Sozlamalari     │
└─────────────────┴─────────────────┴─────────────────┘
       ↓
Kompaniya yaratish
       ↓
Filiallar qo'shish
       ↓
Operatorlar yaratish
       ↓
Xizmatlar sozlash
```

### 4.2 Company Admin Flow

```
Company Admin Login
       ↓
Company Dashboard
       ↓
┌─────────────────┬─────────────────┬─────────────────┐
│ Filiallar       │ Operatorlar     │ Xizmatlar       │
│ Boshqaruvi      │ Boshqaruvi      │ Sozlamalari     │
└─────────────────┴─────────────────┴─────────────────┘
       ↓
Operator qo'shish
       ↓
Xizmatga biriktirish
       ↓
Login/Parol yaratish
```

### 4.3 Customer Flow

```
Customer Portal
       ↓
Kompaniya tanlash
       ↓
Filial tanlash (manzil bo'yicha)
       ↓
Xizmat turi tanlash
       ↓
Vaqt tanlash
       ↓
Ma'lumotlar kiritish
       ↓
Navbat tasdiqlash
       ↓
Raqamli bilet olish
       ↓
Navbatni kuzatish
       ↓
Operator chaqiruvi
       ↓
Xizmat olish
```

### 4.4 Operator Flow

```
Operator Login
       ↓
Operator Dashboard
       ↓
Navbatdagi mijozlar ro'yxati
       ↓
Keyingi mijozni chaqirish
       ↓
Mijoz keldi/kelmadi
       ↓
┌─────────────────┬─────────────────┐
│ Xizmat boshlash │ Keyingi mijoz   │
└─────────────────┴─────────────────┘
       ↓
Xizmat yakunlash
       ↓
Keyingi mijozga o'tish
```

## 5. Queue Logic (Navbat Logikasi)

### 5.1 Service-based Queues

```
Filial A
├── Kassa Xizmati
│   ├── Operator 1 (Oyna 1)
│   ├── Operator 2 (Oyna 2)
│   └── Operator 3 (Oyna 3)
├── Kredit Xizmati
│   ├── Operator 4 (Oyna 4)
│   └── Operator 5 (Oyna 5)
└── Konsultatsiya
    └── Operator 6 (Oyna 6)
```

### 5.2 Multi-Service Operators

```
Operator 1: [Kassa, Plastik kartalar]
Operator 2: [Kassa]
Operator 3: [Kredit, Konsultatsiya]
```

### 5.3 Queue Distribution Algorithm

1. **Xizmat bo'yicha taqsimlash:** Mijoz tanlagan xizmatga mos operatorlar
2. **Prioritet:** VIP mijozlar, nogironlar, keksalar
3. **Vaqt:** Online booking vaqti
4. **Load balancing:** Operatorlar o'rtasida teng taqsimlash

## 6. Technical Architecture

### 6.1 Backend Stack

- **Framework:** Laravel/Node.js
- **Database:** MySQL/PostgreSQL
- **Cache:** Redis
- **Queue:** Redis/RabbitMQ
- **API:** RESTful API + WebSocket

### 6.2 Frontend Stack

- **Customer Portal:** React.js/Vue.js
- **Admin Panels:** React.js + TypeScript
- **Kiosk Interface:** Electron/PWA
- **Styling:** Tailwind CSS

### 6.3 Infrastructure

- **Hosting:** AWS/DigitalOcean
- **CDN:** CloudFlare
- **Monitoring:** New Relic/DataDog
- **Backup:** Automated daily backups

## 7. Security & Multi-Tenancy

### 7.1 Data Isolation

- Har bir kompaniya o'zining `company_id` orqali ajratilgan
- Row-level security
- API level tenant filtering

### 7.2 Authentication

- JWT tokens
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)

### 7.3 Data Privacy

- GDPR compliance
- Data encryption at rest
- Secure API endpoints

## 8. Scalability Features

### 8.1 Horizontal Scaling

- Microservices architecture
- Load balancers
- Database sharding

### 8.2 Performance Optimization

- Caching strategies
- CDN for static assets
- Database indexing
- Query optimization

## 9. Integration Points

### 9.1 SMS Gateway

- Eskiz.uz/Playmobile.uz
- Navbat chaqiruvi uchun SMS

### 9.2 Payment Gateway

- Click/Payme (premium features uchun)

### 9.3 Analytics

- Google Analytics
- Custom dashboard analytics

## 10. Deployment Strategy

### 10.1 Development Environment

- Docker containers
- Local development setup
- Testing databases

### 10.2 Production Environment

- CI/CD pipeline
- Blue-green deployment
- Automated testing
- Monitoring and alerting
