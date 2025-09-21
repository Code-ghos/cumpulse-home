export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-semibold mb-2">About MindCampus</h3>
          <p className="text-sm text-muted-foreground">A digital mental health and psychological support system for higher‑education students. Confidential, inclusive, and evidence‑informed.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Our Approach</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Personalized check‑ins</li>
            <li>Actionable guidance</li>
            <li>Campus resource friendly</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm text-muted-foreground">For support or suggestions, reach us at support@mindcampus.example</p>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-xs text-muted-foreground">© {new Date().getFullYear()} MindCampus. For educational use only.</div>
      </div>
    </footer>
  );
}
