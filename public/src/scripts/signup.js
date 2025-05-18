document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if (password !== confirm) {
    document.getElementById('confirmFeedback').textContent = "Passwords do not match.";
    document.getElementById('confirm').classList.add('is-invalid');
    return;
  }

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Signup successful!');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = '/'; // redirect to homepage or dashboard
    } else {
      alert(data.error || 'Signup failed');
    }
  } catch (err) {
    console.error('Signup error:', err);
    alert('An error occurred during signup');
  }
});
