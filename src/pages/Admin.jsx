    import { useState, useContext } from "react";
    import AuthContext from "../context/AuthContext";
    import { Typography, Input, Button, Checkbox, IconButton } from "@material-tailwind/react";
    import { Link } from "react-router-dom";
    import { Eye, EyeOff, Lock } from "lucide-react";

    const Admin = () => {
        const { login } = useContext(AuthContext);
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState("");
        const [showPassword, setShowPassword] = useState(false);
        const [rememberMe, setRememberMe] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError("");

            try {
                await login(email, password);
                window.location.href = "/admin/dashboard";
            } catch (error) {
                setError("Admin access denied. Please check your credentials.");
            }
        };

        return (
            <div className="min-h-screen flex items-center justify-center p-4 font-poppins">
                <div className="w-full max-w-md  overflow-hidden">
                    {/* Header with admin badge */}
                    <div className="px-6 flex justify-between items-centerborder-orange-500 rounded-md">
                        <Typography variant="h4" className="text-orange-500 font-medium">
                            Admin Portal
                        </Typography>
                    </div>

                    <div className="p-2 px-6">
                        {/* Banner Image Placeholder */}
                        <div className=" rounded-lg pb-4 mb-2">
                            <Typography variant="h6" className="text-black/60 text-xs font-normal">
                                Restricted Access Area
                            </Typography>
                        </div>

                        <Typography variant="small" className="text-gray-600 text-left mb-6">
                            Enter admin credentials to access the control panel
                        </Typography>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <Typography variant="h6" className="text-gray-700 mb-1">
                                    Admin Email
                                </Typography>
                                <Input
                                    size="lg"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="!border-gray-300 focus:!border-orange-500"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <Typography variant="h6" className="text-gray-700 mb-1">
                                    Password
                                </Typography>
                                <Input
                                    size="lg"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="!border-gray-300 focus:!border-orange-500"
                                    placeholder="••••••••"
                                    required
                                    labelProps={{
                                        className: "hidden",
                                    }}
                                />
                                <IconButton
                                    variant="text"
                                    size="sm"
                                    className="!absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </IconButton>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    label={
                                        <Typography variant="small" className="text-gray-600">
                                            Remember this device
                                        </Typography>
                                    }
                                />
                                <Link
                                    to="/admin/forgot-password"
                                    className="text-sm text-orange-500 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-center text-red-500 text-sm py-2">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all"
                            >
                                Authenticate
                            </Button>
                        </form>

                        {/* Security Notice */}
                        <Typography variant="small" className="text-center text-gray-500 mt-6">
                            <Lock className="h-4 w-4 inline-block mr-1" />
                            Your admin activities are logged for security purposes
                        </Typography>

                        {/* Footer */}
                        <Typography variant="small" className="text-center text-gray-400 mt-8">
                            © {new Date().getFullYear()} Admin Dashboard - Vince Pradas
                        </Typography>
                    </div>
                </div>
            </div>
        );
    };

    export default Admin;