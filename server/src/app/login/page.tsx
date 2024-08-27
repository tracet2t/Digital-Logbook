import { Button, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import Title from "antd/es/typography/Title";
import Login from './Login.png'


export default function LoginPage() {
    return (
        <div className="flex h-screen">
            {/* Left Column with Image and Text */}
            <div className="w-1/2 flex flex-col justify-center items-center p-8 bg-gray-100">
            <img src={Login} alt='logo' width="190px" />
                <h2 className="text-xl font-semibold mb-2">Welcome to the Digital Logbook</h2>
                <p className="text-center text-gray-600">
                    Keep your records organized and secure with our modern logbook solution.
                </p>
            </div>

            {/* Right Column with Login Form */}
            <div className="w-1/2 flex justify-center items-center">
                <div className="p-8 w-[400px]">
                    <Title level={2}>Login</Title>
                    <form className="flex flex-col" action={"/auth/login"} method="post">
                        <FormItem label="Username" name="username" colon={false}>
                            <Input name="username" required />
                        </FormItem>
                        <FormItem label="Password" name="password" colon={false}>
                            <Input name="password" type="password" required />
                        </FormItem>
                        <Button type="primary" htmlType="submit">Login</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
