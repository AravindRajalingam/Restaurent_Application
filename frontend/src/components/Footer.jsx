import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-blue-900 text-yellow-100 py-12 px-4 rounded-2xl">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-2 items-center">
                        <h3 className="font-bold text-lg mb-4">Mu Family Restaurant</h3>
                        <p>Authentic cuisine and exceptional service since 2024.</p>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <h3 className="font-bold text-lg mb-4">Contact</h3>
                        <p className="flex gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.27 1.06l-1.27 1.27a16 16 0 006.59 6.59l1.27-1.27a1 1 0 011.06-.27l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
                                />
                            </svg>
                            9344641616

                        </p>
                        <Link className="flex gap-2 items-center" to="https://maps.app.goo.gl/WoWaeDcCXz2raxGr9?g_st=aw">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z"
                                />
                                <circle cx="12" cy="11" r="2.5" />
                            </svg>

                            Thanjavur to Trichy highway, <br />
                            Sengipatti, Thanjavur 613402
                        </Link>

                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <Link to="https://www.instagram.com/mufamilyrestaurant?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="hover:text-yellow-400 font-semibold">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zM12 7a5 5 0 100 10 5 5 0 000-10zm6.5-.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                                </svg>

                            </Link>
                            <Link href="#!" className="hover:text-yellow-400 font-semibold">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M22 12a10 10 0 10-11.5 9.95v-7.04H7.9V12h2.6V9.8c0-2.58 1.54-4 3.9-4 1.13 0 2.3.2 2.3.2v2.5h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.91h-2.4v7.04A10 10 0 0022 12z" />
                                </svg>

                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}