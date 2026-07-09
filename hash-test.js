const bcrypt = require('bcryptjs');

// The password you want to use
const password = 'admin123';

// Generate hash
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
        return;
    }
    console.log('========================================');
    console.log('PASSWORD:', password);
    console.log('HASH:', hash);
    console.log('========================================');
    console.log('');
    console.log('COPY THIS HASH and paste it in your SQL query:');
    console.log(hash);
    console.log('');
    
    // Test the hash immediately
    bcrypt.compare(password, hash, (err, result) => {
        if (err) {
            console.error('Error testing:', err);
            return;
        }
        console.log('Test compare result:', result ? '✅ SUCCESS! Hash matches password.' : '❌ FAILED!');
    });
});