export default function LoginPage() {
    return (
        <div className="p-2 w-[500px]">
            <h2>Login</h2>
            <form className="flex flex-col" action={"/auth/login"} method="post">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}