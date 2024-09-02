export default function LoginPage() {
    return (
        <div className="p-4 w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
            <form className="flex flex-col space-y-4" action="/auth/login" method="post">
                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 text-sm font-medium">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-1 text-sm font-medium">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Login
                </button>
            </form>
        </div>
    );
}