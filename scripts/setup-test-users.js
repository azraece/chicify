const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'chicify';

const testUsers = [
  {
    _id: new ObjectId("675c8b5e123456789012a567"),
    name: "Mevcut Kullanıcı",
    email: "current@example.com",
    username: "currentuser",
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId("675c8b5e123456789012a568"),
    name: "Ayşe Yılmaz",
    email: "ayse@example.com",
    username: "ayseyilmaz",
    followersCount: 234,
    followingCount: 189,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId("675c8b5e123456789012a569"),
    name: "Elif Demir",
    email: "elif@example.com",
    username: "elifdemir",
    followersCount: 156,
    followingCount: 243,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId("675c8b5e123456789012a570"),
    name: "Zeynep Kaya",
    email: "zeynep@example.com",
    username: "zeynepkaya",
    followersCount: 89,
    followingCount: 102,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId("675c8b5e123456789012a571"),
    name: "Merve Öztürk",
    email: "merve@example.com",
    username: "merveozturk",
    followersCount: 298,
    followingCount: 156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId("675c8b5e123456789012a572"),
    name: "Selin Çelik",
    email: "selin@example.com",
    username: "selincelik",
    followersCount: 187,
    followingCount: 203,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function setupTestUsers() {
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('MongoDB\'ye bağlandı');

    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    const followsCollection = db.collection('follows');

    // Mevcut kullanıcıları temizle (sadece test verileri)
    await usersCollection.deleteMany({});
    await followsCollection.deleteMany({});
    console.log('Mevcut test verileri temizlendi');

    // Test kullanıcılarını ekle
    const result = await usersCollection.insertMany(testUsers);
    console.log(`${result.insertedCount} kullanıcı eklendi`);

    // İndeksleri oluştur
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await followsCollection.createIndex({ followerId: 1, followingId: 1 }, { unique: true });
    await followsCollection.createIndex({ followerId: 1 });
    await followsCollection.createIndex({ followingId: 1 });
    console.log('İndeksler oluşturuldu');

    // Verileri kontrol et
    const userCount = await usersCollection.countDocuments();
    console.log(`Toplam kullanıcı sayısı: ${userCount}`);

    console.log('\n✅ Test kullanıcıları başarıyla oluşturuldu!');
    console.log('\nKullanıcılar:');
    testUsers.forEach(user => {
      console.log(`- ${user.name} (${user.username}) - ID: ${user._id}`);
    });

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\nMongoDB bağlantısı kapatıldı');
    }
  }
}

// Script'i çalıştır
setupTestUsers(); 