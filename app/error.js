"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main id="main-content" className="status-page"><div><span className="section-label">Something went wrong</span><h1>We could not load this page</h1><p>Please try again. If the problem continues, contact CottonRose directly.</p><div className="status-page__actions"><button className="btn btn--navy" type="button" onClick={reset}>Try Again</button><a className="btn btn--gold" href="mailto:info@cottonrosebd.com">Email CottonRose</a></div></div></main>;
}
