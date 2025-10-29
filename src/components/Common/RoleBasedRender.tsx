import { RootState } from "@/stores/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

interface RoleBasedRenderProps {
  allowedRoles: string[];
  children: ReactNode;
}

const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({
  allowedRoles,
  children,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const userRoles: (number | string)[] = Array.isArray(user?.role)
    ? user.role.map((r: number | string) => String(r))
    : [String(user?.role)];

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) return null;
  return <>{children}</>;
};

export default RoleBasedRender;
