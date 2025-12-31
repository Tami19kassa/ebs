import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="text-3xl font-bold font-heading text-ebs-crimson tracking-wider">
            EBS<span className="text-white">PREMIER+</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            The premier destination for Ethiopian and African entertainment. 
            Streaming 8K content, live news, and exclusive originals directly to your device.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Facebook size={18} />} />
            <SocialIcon icon={<Twitter size={18} />} />
            <SocialIcon icon={<Instagram size={18} />} />
            <SocialIcon icon={<Youtube size={18} />} />
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Browse</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <FooterLink>Live TV</FooterLink>
            <FooterLink>Movies</FooterLink>
            <FooterLink>TV Shows</FooterLink>
            <FooterLink>Kids</FooterLink>
            <FooterLink>EBS Originals</FooterLink>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-6">Help & Support</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <FooterLink>Account</FooterLink>
            <FooterLink>Help Center</FooterLink>
            <FooterLink>Supported Devices</FooterLink>
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Cookie Preferences</FooterLink>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
           <h4 className="text-white font-bold mb-6">Stay Updated</h4>
           <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for exclusive premieres.</p>
           <div className="flex gap-2">
             <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded px-4 py-2 text-white text-sm w-full focus:border-ebs-crimson outline-none"
             />
             <button className="bg-ebs-crimson text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                <Mail size={16} />
             </button>
           </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
        <p>&copy; 2025 EBS Premier+. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
            <span>Terms of Use</span>
            <span>Legal Notices</span>
            <span>Corporate Information</span>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-ebs-crimson transition-colors">
    {icon}
  </a>
);

const FooterLink = ({ children }: { children: React.ReactNode }) => (
  <li className="hover:text-ebs-crimson cursor-pointer transition-colors">{children}</li>
);