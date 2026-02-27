import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-card text-card-foreground">
            <div className="container mx-auto px-4 py-12 md:py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-tight">AuraRent</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Experience the future of rental management using our smart platform.
                            Find your dream home or manage your properties with ease.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Platform</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/properties" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Browse Properties
                                </Link>
                            </li>
                            <li>
                                <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                                    How it Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/properties" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start space-x-3 text-muted-foreground">
                                <MapPin className="h-5 w-5 shrink-0" />
                                <span>123 Smart St, Tech City, TC 90210</span>
                            </li>
                            <li className="flex items-center space-x-3 text-muted-foreground">
                                <Phone className="h-5 w-5 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3 text-muted-foreground">
                                <Mail className="h-5 w-5 shrink-0" />
                                <span>support@aurarent.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8 text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} AuraRent. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
