using System.Security.Cryptography;
using System.Text;

static string Hash(string password)
{
    byte[] salt = new byte[16];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(salt);
    byte[] pw = Encoding.UTF8.GetBytes(password);
    byte[] combined = new byte[salt.Length + pw.Length];
    Buffer.BlockCopy(salt, 0, combined, 0, salt.Length);
    Buffer.BlockCopy(pw, 0, combined, salt.Length, pw.Length);
    using var sha = SHA256.Create();
    byte[] hash = sha.ComputeHash(combined);
    return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
}

Console.WriteLine($"Admin:    {Hash("Admin@2026!")}");
Console.WriteLine($"Service:  {Hash("Service@2026!")}");
Console.WriteLine($"Mechanic: {Hash("Mechanic@2026!")}");
Console.WriteLine($"Manager:  {Hash("Manager@2026!")}");
