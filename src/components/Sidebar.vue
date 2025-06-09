<!-- src/components/Sidebar.vue -->
<template>
    <!--sidebar wrapper -->
		<div class="sidebar-wrapper" data-simplebar="true">
			<div class="sidebar-header">
				<div>
					<img src="assets/images/logo.jpg" class="logo-icon" alt="logo icon">
				</div>
				<div>
					<h4 class="logo-text">HOSReport</h4>
				</div>
				<div class="toggle-icon ms-auto"><i class='bx bx-first-page'></i>
				</div>
			</div>
			<!--navigation-->
			<ul class="metismenu" id="menu">
				<li>
					<a href="/">
						<div class="parent-icon"><i class='bx bx-clinic'></i>
						</div>
						<div class="menu-title">Dashboard</div>
					</a>
				</li>
				
				<!-- 🔥 แก้ไขเมนู Login เล็กน้อย -->
				<li v-if="!isLoggedIn">
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-lock-open-alt'></i>
						</div>
						<div class="menu-title">เข้าสู่ระบบก่อนใช้งาน</div>
					</a>
					<ul>
						<li><a href="javascript:;" @click="openLoginSidebar"><i class="bx bx-lock-open"></i>เข้าสู่ระบบ</a></li>
					</ul>
				</li>
				
				<!-- 🔥 เพิ่มเมนู User เมื่อ Login แล้ว -->
				<li v-else>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-user-check'></i>
						</div>
						<div class="menu-title">{{ currentUser.name || 'User' }}</div>
					</a>
					<ul>
						<li><a href="javascript:;"><i class="bx bx-group"></i>{{ currentUser.groupname }}</a></li>
						<li><a href="javascript:;" @click="handleLogout"><i class="bx bx-log-out"></i>ออกจากระบบ</a></li>
					</ul>
				</li>

				<li class="menu-label">HOSxP Custom Report</li>
				
				<!-- 🔥 รายงาน HA - แก้ไข @click เท่านั้น -->
				<li>
					<a href="javascript:;" class="has-arrow">
						<div class="parent-icon"><i class='bx bx-bar-chart-square'></i></div>
						<div class="menu-title">รายงาน HA </div>
					</a>
					<ul>
						<li><a href="javascript:;" @click="navigateToReport('/report/stroke', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>Stroke I64</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/strokerefer', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>Stroke Refer</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/stemi', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>Stemi I210-I213</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/nonstemi', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>NonStemi I214</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/sepsis', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>Sepsis</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/sepsisadmit', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>Sepsis Admit</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/admit', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>Admit รวม</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/readmit', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>Re-Admit รวม</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/readmitold', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>Re-Admit ด้วยโรคเดิม</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/ipdrefer', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i>IPD Refer</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/copder', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i> COPD มาตรวจ ER</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/headinjury', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i> Head Injury Severe</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/ipddeath', 'รายงาน HA')"><i class="bx bx-arrow-to-right"></i> รายงานเสียชีวิต IPD</a></li>
					</ul>
				</li>
				
				<!-- 🔥 รายงาน NCDs - แก้ไข @click เท่านั้น -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-bar-chart-alt'></i>
						</div>
						<div class="menu-title">รายงาน NCDs </div>
					</a>
					<ul>
						<li><a href="javascript:;" @click="navigateToReport('/report/ncdpdxnull', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> แผนก NCD Pdx ว่าง </a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/clinicdm', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> ทะเบียน DM </a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/clinicht', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> ทะเบียน HT</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/clinicckd', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> ทะเบียน CKD</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/cliniccopd', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> ทะเบียน COPD </a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/clinicasthma', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> ทะเบียน ASTHMA</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/newdm', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> DM รายใหม่</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/newht', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> HT รายใหม่</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/newckd', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> CKD รายใหม่</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/newcopd', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> COPD รายใหม่</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/newasthma', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> Asthma รายใหม่</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/influlotnull', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> ฉีด Vaccine Influenza</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/dmscreeneye', 'รายงาน NCDs')"><i class="bx bx-arrow-to-right"></i> คัดกรองตา DM</a></li>
					</ul>
				</li>
				
				<!-- 🔥 รายงาน PCU - แก้ไข @click เท่านั้น -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-duplicate' ></i>
						</div>
						<div class="menu-title">รายงาน PCU </div>
					</a>
					<ul>
						<li><a href="javascript:;" @click="navigateToReport('/report/childen', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ทะเบียนกลุ่มอายุ 0-5 ปี</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/student', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ทะเบียนกลุ่มอายุ 6-14 ปี</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/teenager', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ทะเบียนกลุ่มอายุ 15-21 ปี</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/workage', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ทะเบียนกลุ่มอายุ 22-59 ปี</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/elderly', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ทะเบียนผู้สูงอายุ</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/screenpcu', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> คักกรอง 30 - 70 ปี</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/screens', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> คักกรอง 35 ปี ขึ้นไป</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/rapid', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ตรวจ Rapid Covid-19</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/rtpcr', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ตรวจ RTPCR Covid-19</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/denguefever', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ไข้เลือดออก รวม</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/dengue', 'รายงาน PCU')"><i class="bx bx-arrow-to-right"></i> ไข้เลือดออก ต.โพนสวรรค์</a></li>
					</ul>
				</li>
				
				<!-- 🔥 รายงาน ER - แก้ไข @click เท่านั้น -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"> <i class='bx bx-handicap'></i>
						</div>
						<div class="menu-title">รายงาน ER </div>
					</a>
					<ul>
						<li><a href="javascript:;" @click="navigateToReport('/report/pdxnuller', 'รายงาน ER')"><i class="bx bx-arrow-to-right"></i> ไม่มีวินิจฉัย Pdx ว่าง</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/asthmaer', 'รายงาน ER')"><i class="bx bx-arrow-to-right"></i> วินิจฉัย Asthma</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/emergencyer', 'รายงาน ER')"><i class="bx bx-arrow-to-right"></i> อุบัติเหตุจราจร </a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/ettubeer', 'รายงาน ER')"><i class="bx bx-arrow-to-right"></i> ใส่ ET Tube ER</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/cprer', 'รายงาน ER')"><i class="bx bx-arrow-to-right"></i> หัตถการ CPR </a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/castoperer', 'รายงาน ER')"><i class="bx bx-arrow-to-right"></i> หัตถการ เข้าเฝือก</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/defiber', 'รายงาน ER')"><i class="bx bx-arrow-to-right"></i> Defibrillation ER</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/nber', 'รายงาน ER')"><i class="bx bx-arrow-to-right"></i> หัตถการพ่นยา ER</a></li>
					</ul>
				</li>
				
				<!-- 🔥 รายงาน IPD - แก้ไข @click เท่านั้น -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-hotel' ></i>
						</div>
						<div class="menu-title">รายงาน IPD </div>
					</a>
					<ul>
						<li><a href="javascript:;" @click="navigateToReport('/report/admit2hour', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i> Admit 2 hour</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/admitipd', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i> จำนวน Admit รวม</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/readmit', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i>Re-Admit รวม</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/readmitold', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i>Re-Admit ด้วยโรคเดิม</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/admitdm', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i> Admit DM</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/readmitdm', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i> Re-Admit DM</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/admitdmhypo', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i> AdmitDM + Hypogly</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/admitdmhyper', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i> AdmitDM + Hypergly</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/admitdhf', 'รายงาน IPD')"><i class="bx bx-arrow-to-right"></i> Admit DHF</a></li>
					</ul>
				</li>
				
				<!-- 🔥 รายงานกายภาพ - แก้ไข @click เท่านั้น -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-grid-alt"></i>
						</div>
						<div class="menu-title">รายงานกายภาพ </div>
					</a>
					<ul>
						<li><a href="javascript:;" @click="navigateToReport('/report/phypttype', 'รายงานกายภาพ')"><i class="bx bx-arrow-to-right"></i> จำนวนแยกรายสิทธิ</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/physicpatient', 'รายงานกายภาพ')"><i class="bx bx-arrow-to-right"></i> จำนวนผู้รับบริการ</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/physicovertime', 'รายงานกายภาพ')"><i class="bx bx-arrow-to-right"></i> จำนวนนอกเวลาราชการ</a></li>
					</ul>
				</li>
				
				<!-- 🔥 รายงานจิตเวชฯ - แก้ไข @click เท่านั้น -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-donate-heart"></i>
						</div>
						<div class="menu-title">รายงานจิตเวชฯ</div>
					</a>
					<ul>
						<li><a href="javascript:;" @click="navigateToReport('/report/clinicdrug', 'รายงานจิตเวชฯ')"><i class="bx bx-arrow-to-right"></i> คลินิกยาเสพติด</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/admitshizo', 'รายงานจิตเวชฯ')"><i class="bx bx-arrow-to-right"></i> Admit F00-F99</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/screendrink', 'รายงานจิตเวชฯ')"><i class="bx bx-arrow-to-right"></i> คัดกรองบุหรี่-สุรา</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/shizoscreen', 'รายงานจิตเวชฯ')"><i class="bx bx-arrow-to-right"></i> คัดกรอง Z503</a></li>
						<li><a href="javascript:;" @click="navigateToReport('/report/clinicshizo', 'รายงานจิตเวชฯ')"><i class="bx bx-arrow-to-right"></i> คลินิกสุขภาพจิต</a></li>
						<li> <a href="shizo5.php" target="_blank"><i class="bx bx-arrow-to-right"></i>จิตเวชรายใหม่ </a></li>
						<li> <a href="shizo6.php" target="_blank"><i class="bx bx-arrow-to-right"></i>จ่ายยา HALOPERIDOL</a></li>
						<li> <a href="shizo7.php" target="_blank"><i class="bx bx-arrow-to-right"></i>จ่ายยา fluPHENAZine</a></li>
					</ul>
				</li>

				<!-- Pallaitive Care - เหมือนเดิม -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-home-heart"></i>
						</div>
						<div class="menu-title">Pallaitive Care</div>
					</a>
					<ul>
						<li>
							<router-link to="/report/stroke" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i>กลุ่ม Stroke I64
								</a>
							</router-link> 
						</li>
						<li> 
							<router-link to="/report/pallaitiveca" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i>กลุ่ม CA C00 - C96
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/pallaitiveckd" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i>กลุ่ม CKD N185
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/pallaitivecopd" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i>กลุ่ม COPD J44
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/pallaitiveheart" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i>กลุ่ม Heart Failure 
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/telemed" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i>กลุ่ม Telemed
								</a>
							</router-link>
						</li>
					</ul>
				</li>

				<li class="menu-label">HOSxP Custom Report </li>
				<!-- รายงาน การเงิน - เหมือนเดิม -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-bitcoin"></i>
						</div>
						<div class="menu-title">รายงาน การเงิน</div>
					</a>
					<ul>
						<li> <a href="http://192.168.88.6/webaccount/" target="bank"><i class="bx bx-arrow-to-right"></i>Webaccount</a>
						</li>
						<li> 
							<router-link to="/report/pttypesum" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> รายงานแยกตามสิทธิ
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/financenull" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ยังไม่ปิดลูกหนี้สิทธิ
								</a>
							</router-link>
						</li>
					</ul>
				</li>
				
				<!-- รายงาน OPD - เหมือนเดิม -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-map-pin' ></i>
						</div>
						<div class="menu-title">รายงาน OPD </div>
					</a>
					<ul>
						<li> 
							<router-link to="/report/strokesmoking" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> STROKE สูบบุหรี่ 
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/labcovid" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> LAB COVID-19
								</a>
							</router-link>
						</li>
					</ul>
				</li>

				<!-- แพทย์แผนไทย - เหมือนเดิม -->
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-walk"></i>
						</div>
						<div class="menu-title">แพทย์แผนไทย </div>
					</a>
					<ul>
						<li>
							<router-link to="/report/pltpatient" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> จำนวนผู้รับบริการ
								</a>
							</router-link> 
						</li>
					</ul>
				</li>
				<li>
					<a href="#" target="_blank">
						<div class="parent-icon"><i class='bx bx-phone-call' ></i>
						</div>
						<div class="menu-title">Admin Support</div>
					</a>
				</li>
			</ul>
			<!--end navigation-->
		</div>
		<!--end sidebar wrapper -->
		
		<!-- 🔥 เพิ่ม LoginSidebar Component -->
		<LoginSidebar 
			:isVisible="showLoginSidebar" 
			:requestedRoute="requestedRoute"
			@close="closeLoginSidebar" 
			@login-success="handleLoginSuccess" 
		/>
</template>
  
<script>
import LoginSidebar from './LoginSidebar.vue'

export default {
	name: "AppSidebar",
	components: {
		LoginSidebar
	},
	data() {
		return {
			showLoginSidebar: false,
			requestedRoute: '',
			isLoggedIn: false,
			currentUser: {
				name: '',
				groupname: '',
				entryposition: ''
			}
		}
	},
	mounted() {
		// เช็คสถานะ login
		this.checkAuthStatus()
		
		// ฟัง events
		window.addEventListener('open-login-sidebar', this.openLoginSidebar)
		window.addEventListener('auth-status-changed', this.checkAuthStatus)
		
		this.$nextTick(() => {
			// เริ่มต้น MetisMenu เมื่อ DOM เรนเดอร์เสร็จ
			if (window.$ && window.$.fn.metisMenu) {
				$("#menu").metisMenu();
			} else {
				console.error("MetisMenu is not available");
			}
		});
	},
	beforeUnmount() {
		// ลบ event listeners
		window.removeEventListener('open-login-sidebar', this.openLoginSidebar)
		window.removeEventListener('auth-status-changed', this.checkAuthStatus)
	},
	methods: {
		// เช็คสถานะการ login
		async checkAuthStatus() {
			try {
				const { authService } = await import('../services/authService.js')
				
				this.isLoggedIn = authService.isAuthenticated()
				
				if (this.isLoggedIn) {
					const user = authService.getUser()
					this.currentUser = {
						name: user.name || '',
						groupname: user.groupname || '',
						entryposition: user.entryposition || ''
					}
					console.log('✅ Sidebar - User logged in:', this.currentUser.name)
				} else {
					this.currentUser = { name: '', groupname: '', entryposition: '' }
					console.log('❌ Sidebar - No user logged in')
				}
			} catch (error) {
				console.error('Error checking auth status:', error)
			}
		},
		
		// เปิด Login Sidebar
		openLoginSidebar() {
			console.log('🔓 Opening login sidebar')
			this.showLoginSidebar = true
		},
		
		// ปิด Login Sidebar
		closeLoginSidebar() {
			this.showLoginSidebar = false
			this.requestedRoute = ''
		},
		
		// จัดการการนำทางไปรายงาน
		async navigateToReport(route, reportType) {
			console.log(`🔍 Navigating to: ${route} (${reportType})`)
			
			try {
				const { authService } = await import('../services/authService.js')
				
				if (!authService.isAuthenticated()) {
					// ถ้ายังไม่ login ให้เปิด login sidebar
					console.log('❌ Not logged in, opening login sidebar')
					this.requestedRoute = route
					this.openLoginSidebar()
					return
				}
				
				// ตรวจสอบสิทธิ์
				if (!authService.canAccessReport(reportType)) {
					alert(`ไม่มีสิทธิ์เข้าดู ${reportType}\nกลุ่มของคุณ: ${authService.getUserGroup()}`)
					return
				}
				
				// นำทางไปรายงาน
				console.log('✅ Access granted, navigating to:', route)
				this.$router.push(route)
				
			} catch (error) {
				console.error('Error in navigation:', error)
				alert('เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์')
			}
		},
		
		// จัดการเมื่อ login สำเร็จ
		handleLoginSuccess(data) {
			console.log('🎉 Login success received:', data)
			
			this.checkAuthStatus() // อัพเดทสถานะ
			
			// ถ้ามี requested route ให้ไปหน้านั้น
			if (data.requestedRoute) {
				console.log('📍 Redirecting to requested route:', data.requestedRoute)
				this.$router.push(data.requestedRoute)
			}
			
			this.closeLoginSidebar()
		},
		
		// ออกจากระบบ
		async handleLogout() {
			if (confirm('ต้องการออกจากระบบหรือไม่?')) {
				try {
					const { authService } = await import('../services/authService.js')
					authService.logout()
					this.checkAuthStatus()
					
					// ส่ง event แจ้งให้ component อื่นรู้
					window.dispatchEvent(new CustomEvent('auth-status-changed'))
					
					this.$router.push('/') // กลับไปหน้า dashboard
					alert('ออกจากระบบเรียบร้อยแล้ว')
				} catch (error) {
					console.error('Logout error:', error)
				}
			}
		}
	},
	updated() {
		this.$nextTick(() => {
			// อัพเดท MetisMenu เมื่อคอมโพเนนต์มีการเปลี่ยนแปลง
			if (window.$ && window.$.fn.metisMenu) {
				$("#menu").metisMenu();
			}
		});
	},
	watch: {
		// เมื่อ route เปลี่ยน ให้อัพเดท MetisMenu
		$route() {
			this.$nextTick(() => {
				if (window.$ && window.$.fn.metisMenu) {
					$("#menu").metisMenu();
				}
			});
		}
	}
}
</script>