import { Button, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import Title from "antd/es/typography/Title";

export default function LoginPage() {
    return (
        <div className="p-2 w-[500px]">
            <Title level={2}>Login</Title>
            <form className="flex flex-col" action={"/auth/login"} method="post">
                <FormItem label="email" name="email" colon={false}>
                    <Input name="email" required />
                </FormItem>
                <FormItem label="Password" name="password" colon={false}>
                    <Input name="password" type="password" required />
                </FormItem>
                <Button type="primary" htmlType="submit">Login</Button>
            </form>
        </div>
    );

}