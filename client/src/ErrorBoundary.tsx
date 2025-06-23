import React, { Component, ErrorInfo, ReactNode } from "react";
import MaintenancePage from "./pages/maintenance/MaintenancePage"; // импортируй свою заглушку

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    isMaintenance: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
        isMaintenance: false,
    };

    static getDerivedStateFromError(error: any): Partial<State> {
        if (error?.response?.status === 503 || error?.message?.includes("503")) {
            return { hasError: true, isMaintenance: true };
        }
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError && this.state.isMaintenance) {
            return <MaintenancePage />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
