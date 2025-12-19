export default function Footer() {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-blue-900 text-yellow-100 py-12 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Mu Family Restaurant</h3>
                        <p>Authentic cuisine and exceptional service since 2024.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact</h3>
                        <p>123 Food Street, City</p>
                        <p>Email: info@mufamily.com</p>
                        <p>Phone: +1 234 567 890</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#!" className="hover:text-yellow-400 font-semibold">FB</a>
                            <a href="#!" className="hover:text-yellow-400 font-semibold">IG</a>
                            <a href="#!" className="hover:text-yellow-400 font-semibold">TW</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}