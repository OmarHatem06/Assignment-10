export function generateOtpTemplate({
  firstname = "",
  email = "",
  otp = "",
  subject = "OTP Verification",
} = {}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    background:#f4f7fb;
    padding:40px 20px;
}

.container{
    max-width:600px;
    margin:auto;
    background:#fff;
    border-radius:16px;
    padding:40px;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
}

h2{
    color:#1f2937;
    margin-bottom:10px;
    text-align:center;
}

p{
    color:#6b7280;
    font-size:15px;
    line-height:1.7;
    margin-bottom:18px;
}

.info{
    background:#f9fafb;
    padding:15px;
    border-radius:10px;
    margin-bottom:25px;
}

.info strong{
    color:#111827;
}

.otp-box{
    background:#eef4ff;
    border:2px dashed #2563eb;
    border-radius:12px;
    padding:20px;
    text-align:center;
    font-size:36px;
    font-weight:bold;
    letter-spacing:10px;
    color:#2563eb;
    margin:30px 0;
}

.warning{
    background:#fff8e1;
    border-left:4px solid #f59e0b;
    padding:15px;
    border-radius:8px;
    color:#92400e;
    margin-top:20px;
}

.footer{
    margin-top:35px;
    text-align:center;
    color:#9ca3af;
    font-size:13px;
}
</style>

</head>

<body>

<div class="container">

<h2>${subject}</h2>

<p>Hello <strong>${firstname}</strong>,</p>

<p>
Use the verification code below to complete your verification process.
</p>

<div class="info">
<strong>Email:</strong> ${email}
</div>

<div class="otp-box">
${otp}
</div>


<div class="warning">
⚠️ Never share this verification code with anyone. Our team will never ask you for it.
</div>

<div class="footer">
If you didn't request this verification code, you can safely ignore this email.
<br><br>
© ${new Date().getFullYear()} Sara7a App. All rights reserved.
</div>

</div>

</body>
</html>
`;
}
