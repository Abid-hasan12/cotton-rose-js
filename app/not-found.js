import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="status-page"><div><span className="section-label">404</span><h1>Page not found</h1><p>The page may have moved or the address may be incorrect.</p><div className="status-page__actions"><Link className="btn btn--navy" href="/">Return Home</Link><Link className="btn btn--gold" href="/contact">Contact CottonRose</Link></div></div></main>;
}
