import Navbar from "./Navbar";

const { Layout } = require("antd")

const MainLayout = (props) => {
    return (
        <Layout className="theme-light" style={{ backgroundColor: 'transparent' }}>
            <Layout.Header style={{ backgroundColor: 'transparent' }}>
               <Navbar />
            </Layout.Header>
            <Layout.Content style={{ padding: '30px', backgroundColor: "transparent" }}>
                {props.children}
            </Layout.Content>
        </Layout>
    )
}

export default MainLayout;