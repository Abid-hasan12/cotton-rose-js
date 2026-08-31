import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";

export default function SiteLayout({ children }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /><BackToTop /></>;
}
