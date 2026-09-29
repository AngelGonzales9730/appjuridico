
<!DOCTYPE html>
<html lang="es">
	<head>
		<title>APP Juridico</title>
		<link rel="shortcut icon" href="capa_presentacion/images/logop_sf.png" />
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<?php include("capa_presentacion/partial/header.php") ?>
		<style>
			.btn-ingresar{
				position: relative;
				overflow: hidden;
				border: 0;
				border-radius: 10px;
				font-weight: 700;
				letter-spacing: .3px;
				background: linear-gradient(120deg, #3B3B42 0%, #5b5be0 50%, #3B3B42 100%);
				background-size: 200% 100%;
				background-position: 0% 50%;
				box-shadow: 0 6px 18px rgba(91,91,224,.25);
				transition: background-position .6s ease, transform .15s ease, box-shadow .25s ease;
			}
			.btn-ingresar:hover{
				background-position: 100% 50%;
				transform: translateY(-2px);
				box-shadow: 0 12px 26px rgba(91,91,224,.45);
				color:#fff;
			}
			.btn-ingresar:active{
				transform: translateY(0);
				box-shadow: 0 5px 14px rgba(91,91,224,.35);
			}
			/* Brillo que cruza el botón al pasar el cursor */
			.btn-ingresar::after{
				content:"";
				position:absolute;
				top:0;
				left:-120%;
				width:60%;
				height:100%;
				background: linear-gradient(120deg, transparent, rgba(255,255,255,.45), transparent);
				transform: skewX(-20deg);
				transition: left .6s ease;
			}
			.btn-ingresar:hover::after{ left:130%; }
		</style>
	</head>
	<!--end::Head-->
	<!--begin::Body-->
	<body id="kt_body" class="app-blank">
		<div class="d-flex flex-column flex-root" id="kt_app_root">
			<div class="d-flex flex-column flex-lg-row flex-column-fluid">
				<div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
					<div class="d-flex flex-center flex-column flex-lg-row-fluid">
						<div class="w-lg-500px p-10">
							<form class="form w-100" novalidate="novalidate">

								<div class="text-center mb-11">
									<h1 class="text-dark fw-bolder mb-3">Agencia de Servicios Legales del Perú</h1>
									<div class="text-gray-500 fw-semibold fs-6">Aplicativo web</div>
								</div>

								<div class="separator separator-content my-14">
									<span class="w-125px text-gray-500 fw-semibold fs-7">Ingrese sus credenciales</span>
								</div>

								<div class="fv-row mb-8">
									<input type="text" placeholder="Usuario" name="txtUsuario" id="txtUsuario" autocomplete="off" class="form-control bg-transparent" />
								</div>

								<div class="fv-row mb-3 position-relative">
									<input type="password" placeholder="Contraseña" name="txtPassword" id="txtPassword" autocomplete="off" class="form-control bg-transparent pe-12" />
									<span class="toggle-clave position-absolute top-50 end-0 translate-middle-y me-4" data-target="txtPassword" style="cursor:pointer;">
										<i class="ki-duotone ki-eye fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
									</span>
								</div>
								<!--end::Input group=-->
								<!--begin::Wrapper-->
								<div class="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
									<div></div>
								</div>
								<!--end::Wrapper-->
								<div class="d-grid mb-10">
									<button type="button" id="btnSign" class="btn btn-md text-white btn-ingresar">
										<!--begin::Indicator label-->
										<span class="indicator-label"><i class="ki-duotone ki-entrance-right fs-3 me-2"><span class="path1"></span><span class="path2"></span></i>Ingresar</span>
										<!--end::Indicator label-->
										<!--begin::Indicator progress-->
										<span class="indicator-progress">Procesando...
										<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
										<!--end::Indicator progress-->
									</button>
								</div>
								<!--begin::Sign up-->
								<!-- <div class="text-gray-500 text-center fw-semibold fs-6">Not a Member yet?
								<a href="../../demo1/dist/authentication/layouts/corporate/sign-up.html" class="link-primary">Sign up</a></div> -->
								<!--end::Sign up-->
							</form>
							<!--end::Form-->
						</div>
						<!--end::Wrapper-->
					</div>
					<!--end::Form-->
					<!--begin::Footer-->
					<div class="w-lg-500px d-flex flex-stack px-10 mx-auto">
						<!--begin::Languages-->
						<div class="me-10">
							<!--begin::Toggle-->
							<!-- <button class="btn btn-flex btn-link btn-color-gray-700 btn-active-color-primary rotate fs-base" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start" data-kt-menu-offset="0px, 0px">
								<img data-kt-element="current-lang-flag" class="w-20px h-20px rounded me-3" src="<?= URL_ICONS ?>/flags/united-states.svg" alt="" />
								<span data-kt-element="current-lang-name" class="me-1">English</span>
								<span class="d-flex flex-center rotate-180">
									<i class="ki-duotone ki-down fs-5 text-muted m-0"></i>
								</span>
							</button> -->
							<!--end::Toggle-->
							<!--begin::Menu-->
							<div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-4 fs-7" data-kt-menu="true" id="kt_auth_lang_menu">
								<!--begin::Menu item-->
								<div class="menu-item px-3">
									<a href="#" class="menu-link d-flex px-5" data-kt-lang="English">
										<span class="symbol symbol-20px me-4">
											<img data-kt-element="lang-flag" class="rounded-1" src="<?= URL_ICONS ?>/flags/united-states.svg" alt="" />
										</span>
										<span data-kt-element="lang-name">English</span>
									</a>
								</div>
								<!--end::Menu item-->
								<!--begin::Menu item-->
								<div class="menu-item px-3">
									<a href="#" class="menu-link d-flex px-5" data-kt-lang="Spanish">
										<span class="symbol symbol-20px me-4">
											<img data-kt-element="lang-flag" class="rounded-1" src="<?= URL_ICONS ?>/flags/spain.svg" alt="" />
										</span>
										<span data-kt-element="lang-name">Spanish</span>
									</a>
								</div>
								<!--end::Menu item-->
								<!--begin::Menu item-->
								<div class="menu-item px-3">
									<a href="#" class="menu-link d-flex px-5" data-kt-lang="German">
										<span class="symbol symbol-20px me-4">
											<img data-kt-element="lang-flag" class="rounded-1" src="<?= URL_ICONS ?>/flags/germany.svg" alt="" />
										</span>
										<span data-kt-element="lang-name">German</span>
									</a>
								</div>
								<!--end::Menu item-->
								<!--begin::Menu item-->
								<div class="menu-item px-3">
									<a href="#" class="menu-link d-flex px-5" data-kt-lang="Japanese">
										<span class="symbol symbol-20px me-4">
											<img data-kt-element="lang-flag" class="rounded-1" src="<?= URL_ICONS ?>/flags/japan.svg" alt="" />
										</span>
										<span data-kt-element="lang-name">Japanese</span>
									</a>
								</div>
								<!--end::Menu item-->
								<!--begin::Menu item-->
								<div class="menu-item px-3">
									<a href="#" class="menu-link d-flex px-5" data-kt-lang="French">
										<span class="symbol symbol-20px me-4">
											<img data-kt-element="lang-flag" class="rounded-1" src="<?= URL_ICONS ?>/flags/france.svg" alt="" />
										</span>
										<span data-kt-element="lang-name">French</span>
									</a>
								</div>
								<!--end::Menu item-->
							</div>
							<!--end::Menu-->
						</div>
						<!--end::Languages-->
						<!--begin::Links-->
						<!-- <div class="d-flex fw-semibold text-primary fs-base gap-5">
							<a href="../../demo1/dist/pages/team.html" target="_blank">Terms</a>
							<a href="../../demo1/dist/pages/pricing/column.html" target="_blank">Plans</a>
							<a href="../../demo1/dist/pages/contact.html" target="_blank">Contact Us</a>
						</div> -->
						<!--end::Links-->
					</div>
					<!--end::Footer-->
				</div>
				<!--end::Body-->
				<!--begin::Aside-->
				<div class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2" style="background-image: url(<?= URL_IMAGES ?>/logop.png)">
					<!--begin::Content-->
					<div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
						
						
					</div>
				</div>
			</div>
		</div>
		<?php require_once("capa_presentacion/partial/footer.php"); ?>
		<script src="capa_presentacion/view/caso-login/interface.js"></script>
	</body>
</html>
