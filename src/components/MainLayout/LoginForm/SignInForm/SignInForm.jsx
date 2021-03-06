import React, { useState } from "react";
import { Button, Typography } from "antd";
import { useLocalStore, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import useCurrentUserStore from "stores/CurrentUserStore";
import FormInput from "components/Common/FormInput/FormInput";
import axios from "axios";

const { Title } = Typography;

const fetcher = axios.create({
  baseURL: "/api",
});

const SignInForm = ({ onOk }) => {
  const { t } = useTranslation();
  const currentUserStore = useCurrentUserStore();

  const [loading, setLoading] = useState(false);
  const formState = useLocalStore(() => ({
    email: {
      value: "",
      error: null,
      dirty: false,
    },
    password: {
      value: "",
      error: null,
      dirty: false,
    },
  }));

  const cleanForm = () => {
    formState.email.error = null;
    formState.email.dirty = false;

    formState.password.error = null;
    formState.password.dirty = false;
  };

  const onSubmit = async () => {
    setLoading(true);
    cleanForm();

    await fetcher
      .post("login", {
        email: formState.email.value,
        password: formState.password.value,
      })
      .then(({ data }) => {
        onLogin(data);
      })
      .catch(({ response }) => {
        setLoading(false);
        console.log(response?.data);
        switch (response?.data) {
          case "Incorrect Password":
            formState.password.error = "login.error.wrong_password";
            break;
          case "Invalid Email":
            formState.email.error = "login.error.invalid_email";
            break;
          case "Email Not Found":
            formState.email.error = "login.error.email_not_found";
            break;
          default:
        }
      });
  };

  const onLogin = (user) => {
    // console.log("onLogin", user);
    currentUserStore.setUser(user);
    setLoading(false);
    onOk();
  };

  return (
    <div style={{ width: "45%", margin: "0 48px 0 48px" }}>
      <Title level={4}>{t("login.sign_in")}</Title>
      <FormInput
        formState={formState}
        name="email"
        icon="user"
        type="email"
        placeholder={t("login.labels.email")}
      />
      <FormInput
        formState={formState}
        name="password"
        icon="lock"
        type="password"
        placeholder={t("login.labels.password")}
      />
      <Button
        type="primary"
        icon={loading ? "loading" : "play-circle"}
        disabled={loading}
        onClick={onSubmit}
      >
        {t("login.login_button")}
      </Button>
    </div>
  );
};

export default observer(SignInForm);
