<template>
  <div class="auth-page">
    <div class="glow red-glow"></div>
    <div class="glow dark-glow"></div>
    <div class="mesh-background"></div>

    <div class="container">
      <div class="auth-wrapper" :class="{ 'is-register': !isLogin }">
        
        <!-- Brand Side -->
        <authBrandSide />

        <!-- Form Side -->
        <div class="form-side">
          <div class="form-content">
            
            <!-- CASO : PANTALLA DE CÓDIGO 2FA -->
            <div v-if="requires2FA" class="auth-form 2fa-flow">
              <div class="header-text">
                <h2>Verificación de Seguridad</h2>
                <p>Ingresa el código de 6 dígitos enviado a tu celular.</p>
              </div>

              <authInput 
                id="twoFactorCode"
                v-model="form.twoFactorCode"
                label="Código de Seguridad"
                placeholder="000000"
                maxlength="6"
                required
              />

              <div v-if="error" class="login-error">
                {{ error }}
              </div>

              <button @click="handleVerify2FA" class="submit-btn" :disabled="isLoading">
                <span class="btn-text">
                  {{ isLoading ? 'VERIFICANDO...' : 'VERIFICAR CÓDIGO' }}
                </span>
              </button>

              <div class="footer-links">
                <a href="#" @click.prevent="requires2FA = false" class="link red">Volver al login</a>
              </div>
            </div>

            <!-- CASO 🏠: LOGIN O REGISTRO NORMAL -->
            <form v-else @submit.prevent="handleSubmit" class="auth-form">
              <!-- Solo para Registro: Pedir Cédula  -->
              <authInput 
                v-if="!isLogin"
                id="cedula"
                v-model="form.cedula"
                label="Cédula de Identidad"
                required
              />

              <!-- MENSAJE DE AUTOCOMPLETADO (NOMBRE LEGAL - Requerimiento Bladimir) -->
              <div v-if="legalName && !isLogin" class="welcome-legal-name">
                <span class="pulse-icon">✅</span> Bienvenido/a, <strong>{{ legalName }}</strong>
              </div>

              <authInput 
                id="username"
                v-model="form.username"
                label="Usuario"
                v-if="isLogin || (!isLogin && !isGoogle)"
                required
              />

              <!-- Solo para Registro: Pedir Email -->
              <authInput 
                v-if="!isLogin && !isGoogle"
                id="email"
                v-model="form.email"
                type="email"
                label="Correo Electrónico"
                required
              />

              <!-- Solo para Registro: Pedir Teléfono (REQUERIMIENTO 2FA) -->
              <authInput 
                v-if="!isLogin && !isGoogle"
                id="phone"
                v-model="form.phone"
                type="tel"
                label="Número Telefónico"
                placeholder="+506 0000 0000"
                required
              />

              <authInput 
                id="password"
                v-model="form.password"
                type="password"
                label="Contraseña"
                v-if="isLogin || (!isLogin && !isGoogle)"
                required
              />

              <!-- Solo para Registro -->
              <authInput 
                v-if="!isLogin && !isGoogle"
                id="confirmPassword"
                type="password"
                label="Confirmar Contraseña"
                required
              />

              <div v-if="error" class="login-error">
                {{ error }}
              </div>

              <button type="submit" class="submit-btn" :disabled="isLoading">
                <span class="btn-text">
                  {{ isLoading ? 'PROCESANDO...' : (isLogin ? 'INICIAR SESIÓN' : (isGoogle ? 'VINCULAR CUENTA' : 'REGISTRARME')) }}
                </span>
              </button>

              <!-- Botón de Google -->
              <div v-if="isLogin" class="google-login-container">
                  <div class="separator">
                      <span>O continúa con</span>
                  </div>
                  <button type="button" @click="initGoogleLogin" class="google-btn">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                      Google
                  </button>
              </div>
              
              <div class="footer-links">
                <p v-if="isLogin">
                  ¿No tienes una cuenta? 
                  <a href="#" @click.prevent="isLogin = false" class="link red">Únete a la flota</a>
                </p>
                <p v-else-if="!isGoogle">
                  ¿Ya eres parte de TicoAutos? 
                  <a href="#" @click.prevent="isLogin = true" class="link red">Inicia Sesión</a>
                </p>
                <p class="explore-without-account-wrapper">
                  <a href="#" @click.prevent="$router.push('/vehicles')" class="link outline explore-btn">Explorar sin cuenta 🔍</a>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import authBrandSide from './authBrandSide.vue';
import authInput from './authInput.vue';
import { useAuth } from '@/composables/useAuth.js';

const { 
  form, 
  isLogin, 
  isGoogle,
  requires2FA, 
  isLoading, 
  error, 
  legalName, 
  handleSubmit, 
  handleVerify2FA, 
  initGoogleLogin 
} = useAuth();
</script>

<style src="../../assets/styles/auth.css"></style>
<style scoped src="../../assets/styles/loginViewScoped.css"></style>
