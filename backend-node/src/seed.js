const mongoose = require('mongoose');
const Organization = require('./models/Organization');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/narrative_reports');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Organization.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create sample organization
    const organization = new Organization({
      name: 'Asociación Civil Ejemplo',
      description: 'Organización dedicada al desarrollo social y comunitario en México',
      mission: 'Mejorar la calidad de vida de comunidades vulnerables a través de programas de educación, salud y desarrollo económico',
      vision: 'Ser líderes en el desarrollo comunitario sostenible en la región',
      legalStatus: 'A.C.',
      location: 'Ciudad de México, México',
      website: 'https://ejemplo.org',
      email: 'contacto@ejemplo.org',
      phone: '+52 55 1234 5678'
    });

    await organization.save();
    console.log('Created sample organization');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const user = new User({
      email: 'admin@ejemplo.org',
      password: hashedPassword,
      fullName: 'Administrador del Sistema',
      role: 'admin',
      organization: organization._id,
      isActive: true
    });

    await user.save();

    // Add user to organization
    organization.users.push(user._id);
    await organization.save();

    console.log('Created admin user');
    console.log('Admin credentials:');
    console.log('Email: admin@ejemplo.org');
    console.log('Password: admin123');
    console.log('\nSeed completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
