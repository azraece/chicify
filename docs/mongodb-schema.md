# MongoDB Schema Documentation

## Veritabanı: `chicify`

### Koleksiyonlar

#### 1. `users` Koleksiyonu
```javascript
{
  _id: ObjectId("..."),
  name: String,
  email: String,
  username: String,
  profileImage: String,
  followersCount: Number,
  followingCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**İndeksler:**
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
```

#### 2. `follows` Koleksiyonu
```javascript
{
  _id: ObjectId("..."),
  followerId: ObjectId, // Takip eden kullanıcının ID'si
  followingId: ObjectId, // Takip edilen kullanıcının ID'si
  createdAt: Date
}
```

**İndeksler:**
```javascript
db.follows.createIndex({ followerId: 1, followingId: 1 }, { unique: true })
db.follows.createIndex({ followerId: 1 })
db.follows.createIndex({ followingId: 1 })
```

## API Endpoints

### Follow/Unfollow İşlemleri

#### POST `/api/follow`
Takip etme veya takibi bırakma işlemi

**Request Body:**
```json
{
  "followerId": "ObjectId string",
  "followingId": "ObjectId string",
  "action": "follow" | "unfollow"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Kullanıcı başarıyla takip edildi",
  "action": "followed"
}
```

#### GET `/api/follow?followerId=...&followingId=...`
Takip durumunu kontrol etme

**Response:**
```json
{
  "isFollowing": true,
  "followedAt": "2024-01-01T00:00:00.000Z"
}
```

## Veritabanı Kurulumu

1. MongoDB'yi yerel olarak kurun
2. Veritabanını başlatın:
```bash
mongod
```

3. MongoDB shell'e bağlanın:
```bash
mongosh
```

4. Veritabanını ve koleksiyonları oluşturun:
```javascript
use chicify

// Users koleksiyonu
db.users.insertOne({
  name: "Test User",
  email: "test@example.com",
  username: "testuser",
  followersCount: 0,
  followingCount: 0,
  createdAt: new Date()
})

// İndeksleri oluşturun
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.follows.createIndex({ followerId: 1, followingId: 1 }, { unique: true })
db.follows.createIndex({ followerId: 1 })
db.follows.createIndex({ followingId: 1 })
```

## Environment Variables

`.env.local` dosyasına ekleyin:
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=chicify
```

## Kullanım

Follow sistemi şu şekilde çalışır:

1. **Takip Etme:**
   - `follows` koleksiyonunda ilişki kontrol edilir
   - Eğer yoksa yeni ilişki eklenir
   - Her iki kullanıcının sayıları güncellenir
   - Tüm işlemler transaction içinde yapılır

2. **Takibi Bırakma:**
   - `follows` koleksiyonundan ilişki silinir
   - Her iki kullanıcının sayıları azaltılır
   - Tüm işlemler transaction içinde yapılır

3. **Durum Kontrolü:**
   - İki kullanıcı arasındaki takip durumu sorgulanır
   - Boolean değer döndürülür 