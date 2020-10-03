import { Input, Button } from "antd";
import styled from "@emotion/styled";
import { FormInput } from "components/MainLayout/LoginForm/FormInput/FormInput";

export const ProjectInput = styled(FormInput)`
	width: 60%;
	margin-left: 20%;
	align-self: center;
`;

export const CreateProjectButton = styled(Button)`
	width: 60%;
	margin-bottom: 20px;
	align-self: flex-end;
`;