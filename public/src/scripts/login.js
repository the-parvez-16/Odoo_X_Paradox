document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Simple validation example
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  // Simulate login (replace with real authentication)
  alert('Login successful!\nEmail: ' + email);
});

