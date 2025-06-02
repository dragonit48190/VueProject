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
				<li>
				<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-lock-open-alt'></i>
						</div>
						<div class="menu-title">เข้าสู่ระบบก่อนใช้งาน</div>
					</a>
					<ul>
					<li> <a href="login.php" target="_blank"><i class="bx bx-lock-open"></i>เข้าสู่ระบบ</a>
						</li>
					</ul>
				</li>

				<li class="menu-label">HOSxP Custom Report</li>
				<li>
    <a href="javascript:;" class="has-arrow">
        <div class="parent-icon"><i class='bx bx-bar-chart-square'></i></div>
        <div class="menu-title">รายงาน HA </div>
    </a>
    <ul>
        <li>
            <router-link to="/report/stroke" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>Stroke I64
                </a>
            </router-link>
        </li>
        <li>
            <router-link to="/report/strokerefer" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>Stroke Refer
                </a>
            </router-link>
        </li>
        <li> 
            <router-link to="/report/stemi" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>Stemi I210-I213
                </a>
            </router-link>
        </li>
        <li>
            <router-link to="/report/nonstemi" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>NonStemi I214
                </a>
            </router-link>
        </li>
        <li>
            <router-link to="/report/sepsis" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>Sepsis
                </a>
            </router-link>
        </li>
		<li>
            <router-link to="/report/sepsisadmit" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>Sepsis Admit
                </a>
            </router-link>
        </li>
		<li>
            <router-link to="/report/admit" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>Admit รวม
                </a>
            </router-link>
        </li>
		<li>
            <router-link to="/report/readmit" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>Re-Admit รวม
                </a>
            </router-link>
        </li>
		<li>
            <router-link to="/report/readmitold" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>Re-Admit ด้วยโรคเดิม
                </a>
            </router-link>
        </li>
		<li>
            <router-link to="/report/ipdrefer" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i>IPD Refer
                </a>
            </router-link>
        </li>
		<li>
            <router-link to="/report/copder" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i> COPD มาตรวจ ER
                </a>
            </router-link>
        </li>
		<li>
            <router-link to="/report/headinjury" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i> Head Injury Severe
                </a>
            </router-link>
        </li>
		<li>
            <router-link to="/report/ipddeath" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i> รายงานเสียชีวิต IPD
                </a>
            </router-link>
        </li>
    </ul>
</li>
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-bar-chart-alt'></i>
						</div>
						<div class="menu-title">รายงาน NCDs </div>
					</a>
					<ul>
						<li> 
							<router-link to="/report/ncdpdxnull" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> แผนก NCD Pdx ว่าง 
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/clinicdm" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียน DM 
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/clinicht" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียน HT
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/clinicckd" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียน CKD
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/cliniccopd" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียน COPD 
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/clinicasthma" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียน ASTHMA
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/newdm" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> DM รายใหม่
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/newht" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> HT รายใหม่
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/newckd" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> CKD รายใหม่
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/newcopd" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> COPD รายใหม่
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/newasthma" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> Asthma รายใหม่
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/influlotnull" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ฉีด Vaccine Influenza
								</a>
							</router-link>
						
						</li>
						<li> 
							<router-link to="/report/dmscreeneye" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> คัดกรองตา DM
								</a>
							</router-link>
						</li>
					</ul>
				</li>
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-duplicate' ></i>
						</div>
						<div class="menu-title">รายงาน PCU </div>
					</a>
					<ul>
						<li> 
							<router-link to="/report/childen" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียนกลุ่มอายุ 0-5 ปี
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/student" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียนกลุ่มอายุ 6-14 ปี
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/teenager" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียนกลุ่มอายุ 15-21 ปี
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/workage" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียนกลุ่มอายุ 22-59 ปี
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/elderly" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ทะเบียนผู้สูงอายุ
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/screenpcu" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> คักกรอง 30 - 70 ปี
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/screens" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> คักกรอง 35 ปี ขึ้นไป
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/rapid" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ตรวจ Rapid Covid-19
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/rtpcr" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ตรวจ RTPCR Covid-19
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/denguefever" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ไข้เลือดออก รวม
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/dengue" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ไข้เลือดออก ต.โพนสวรรค์
								</a>
							</router-link>
						</li>
					</ul>
				</li>
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"> <i class='bx bx-handicap'></i>
						</div>
						<div class="menu-title">รายงาน ER </div>
					</a>
					<ul>
						<li> 
							<router-link to="/report/pdxnuller" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ไม่มีวินิจฉัย Pdx ว่าง
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/asthmaer" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> วินิจฉัย Asthma
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/emergencyer" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> อุบัติเหตุจราจร 
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/ettubeer" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> ใส่ ET Tube ER
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/cprer" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> หัตถการ CPR 
								</a>
							</router-link> 
						</li>
						<li>
							<router-link to="/report/castoperer" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> หัตถการ เข้าเฝือก
								</a>
							</router-link>  
						</li>
						<li>
							<router-link to="/report/defiber" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> Defibrillation ER
								</a>
							</router-link> 
						</li>
						<li>
							<router-link to="/report/nber" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> หัตถการพ่นยา ER
								</a>
							</router-link> 
						</li>
					</ul>
				</li>
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-hotel' ></i>
						</div>
						<div class="menu-title">รายงาน IPD </div>
					</a>
					<ul>
						<li>
							<router-link to="/report/admit2hour" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> Admit 2 hour
								</a>
							</router-link>  
						</li>
						<li> 
							<router-link to="/report/admitipd" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> จำนวน Admit รวม
								</a>
							</router-link>  
						</li>
						<li>
							<router-link to="/report/readmit" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i>Re-Admit รวม
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/readmitold" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i>Re-Admit ด้วยโรคเดิม
								</a>
							</router-link>
						</li>
						<li> 
							<router-link to="/report/admitdm" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> Admit DM
								</a>
							</router-link>
						</li>
						<li>
							<router-link to="/report/readmitdm" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> Re-Admit DM
								</a>
							</router-link> 
						</li>
						<li>
							<router-link to="/report/admitdmhypo" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> AdmitDM + Hypogly
								</a>
							</router-link> 
						</li>
						<li> 
							<router-link to="/report/admitdmhyper" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> AdmitDM + Hypergly
								</a>
							</router-link> 
						</li>
						<li> 
							<router-link to="/report/admitdhf" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> Admit DHF
								</a>
							</router-link> 
						</li>
					</ul>
				</li>
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-grid-alt"></i>
						</div>
						<div class="menu-title">รายงานกายภาพ </div>
					</a>
					<ul>
						<li> 
							<router-link to="/report/phypttype" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> จำนวนแยกรายสิทธิ
								</a>
							</router-link> 
						</li>
						<li> <a href="pro.php"><i class="bx bx-arrow-to-right"></i>รายการหัตถการ</a>
						</li>
					</ul>
				</li>
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-donate-heart"></i>
						</div>
						<div class="menu-title">รายงานจิตเวชฯ</div>
					</a>
					<ul>
					<li> <a href="shizo.php" target="_blank"><i class="bx bx-arrow-to-right"></i>Admit F00-F99</a>
						</li>
						<li> <a href="shizo2.php" target="_blank"><i class="bx bx-arrow-to-right"></i>คัดกรอง Z530</a>
						</li>
						<li> <a href="shizo3.php" target="_blank"><i class="bx bx-arrow-to-right"></i>คัดกรอง Z530</a>
						</li>
						<li> <a href="shizo4.php" target="_blank"><i class="bx bx-arrow-to-right"></i>ลงทะเบียน จิตเวช</a>
						</li>
						<li> <a href="shizo5.php" target="_blank"><i class="bx bx-arrow-to-right"></i>จิตเวชรายใหม่ </a>
						</li>
						<li> <a href="shizo6.php" target="_blank"><i class="bx bx-arrow-to-right"></i>จ่ายยา HALOPERIDOL</a>
						</li>
						<li> <a href="shizo7.php" target="_blank"><i class="bx bx-arrow-to-right"></i>จ่ายยา fluPHENAZine</a>
						</li>
					</ul>
				</li>

				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-home-heart"></i>
						</div>
						<div class="menu-title">Pallaitive Care</div>
					</a>
					<ul>
						<li> <a href="pal-page1.php" target="_blank"><i class="bx bx-arrow-to-right"></i>xxx</a>
						</li>
						<li> <a href="pal-page2.php" target="_blank"><i class="bx bx-arrow-to-right"></i>xxx</a>
						</li>
						<li> <a href="pal-page3.php" target="_blank"><i class="bx bx-arrow-to-right"></i>xxx</a>
						</li>
						<li> <a href="pal-page4.php" target="_blank"><i class="bx bx-arrow-to-right"></i>xxx</a>
						</li>
					</ul>
				</li>

				<li class="menu-label">HOSxP Custom Report </li>
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-bitcoin"></i>
						</div>
						<div class="menu-title">รายงาน การเงิน</div>
					</a>
					<ul>
						<li> <a href="ptype.php"><i class="bx bx-arrow-to-right"></i>Webaccount</a>
						</li>
						<li> 
							<router-link to="/report/pttypesum" custom v-slot="{ navigate, href }">
								<a @click="navigate" :href="href">
									<i class="bx bx-arrow-to-right"></i> รายงานแยกตามสิทธิ
								</a>
							</router-link>
						</li>
						<li> <a href="ptype3.php"><i class="bx bx-arrow-to-right"></i>ยังไม่ปิดลูกหนี้</a>
						</li>
					</ul>
				</li>
				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class='bx bx-map-pin' ></i>
						</div>
						<div class="menu-title">รายงาน OPD </div>
					</a>
					<ul>
						<li> <a href="top10.php"><i class="bx bx-arrow-to-right"></i>10 อันดับโรค</a>
						</li>
						<li> <a href="top10refer.php"><i class="bx bx-arrow-to-right"></i>10 อันดับ Refer</a>
						</li>
					</ul>
				</li>

				<li>
					<a class="has-arrow" href="javascript:;">
						<div class="parent-icon"><i class="bx bx-walk"></i>
						</div>
						<div class="menu-title">รายงาน แพทย์แผนไทย </div>
					</a>
					<ul>
						<li> <a class="has-arrow" href="timeout.php"><i class="bx bx-arrow-to-right"></i>นอกเวลาราชการ</a>
							<ul>
								<li> <a class="has-arrow" href="drug.php"><i class="bx bx-arrow-to-right"></i>จ่ายยาสมุนไพร</a>
									<ul>
										<li> <a href="gunca.php"><i class="bx bx-arrow-to-right"></i>จ่ายยากัญชา</a>
										</li>
									</ul>
								</li>
							</ul>
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
    
</template>
  
<script>
export default {
  name: "AppSidebar",
  mounted() {
    this.$nextTick(() => {
      // เริ่มต้น MetisMenu เมื่อ DOM เรนเดอร์เสร็จ
      if (window.$ && window.$.fn.metisMenu) {
        $("#menu").metisMenu();
      } else {
        console.error("MetisMenu is not available");
      }
    });
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
  