import { Col, Row } from "antd";
import ActivityLog from "../Components/ActivityLog";
import Categories from "../Components/Categories";
import ProjectModal from "../Components/CreateProjectModal";
import FundProjectModal from "../Components/Fund";
import Projects from "../Components/Projects";
import RegisterModal from "../Components/RegisterModal";

export default function Dashboard(){

    return(
        <Row justify="center" align="center" gutter={8}>
            <Col xs={0} md={4}>
                <Categories />
            </Col>
            <Col xs={24} md={13}>
                <RegisterModal/>
                <ProjectModal />
                <FundProjectModal />
                <Projects />
            </Col>
            <Col xs={0} md={5}>
                <ActivityLog  />
            </Col>
        </Row>
    );

}