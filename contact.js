document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const status = document.getElementById('formStatus');
  const button = document.querySelector('button[type="submit"]');

  if (!name || !email || !message) {
    status.textContent = 'Please fill out all required fields.';
    status.style.color = '#e74c3c';
    return;
  }

  button.disabled = true;
  status.textContent = "Sending...";
  status.style.color = "#3498db";

  //  service,   templet
  emailjs.send("service_vpudnjb", "template_4zuf9w1", {
    name: name,
    email: email,
    message: message
  })
  .then(() => {
    status.textContent = "Thank you! Your message has been sent.";
    status.style.color = "#27ae60";
    document.getElementById('contactForm').reset();

    setTimeout(() => {
      status.textContent = "";
      button.disabled = false;
    }, 3000);
  })
  .catch(() => {
    status.textContent = "Something went wrong. Please try again.";
    status.style.color = "#e74c3c";
    button.disabled = false;
  });
});