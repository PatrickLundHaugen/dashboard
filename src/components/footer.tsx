function Footer() {
  return (
    <footer className="flex justify-between py-2 px-4 *:text-sm *:text-muted-foreground">
      <p>This product is subject to change.</p>
      <p>
        &copy; 2025{" "}
        <a
          href="https://github.com/PatrickLundHaugen/dashboard"
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          Patrick
        </a>
      </p>
    </footer>
  );
}

export default Footer;
