import { HeaderContainer } from './styles'

import { PhosphorLogo, Hamburger, Scroll, User, SignOut } from 'phosphor-react'
import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <HeaderContainer>
    <PhosphorLogo size={40} />
      <nav>
        <NavLink to="/dashboard" title="Entregas">
          <Hamburger  size={24} />
        </NavLink>
        <NavLink to="/relatorios" title="Relatórios">
          <Scroll size={24} />
        </NavLink>
        <NavLink to="/perfil" title="Perfil">
          <User  size={24} />
        </NavLink>
        <NavLink to="" title="Sair">
          <SignOut  size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
