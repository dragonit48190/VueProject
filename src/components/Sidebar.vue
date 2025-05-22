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
            <router-link to="/report/serverehi" custom v-slot="{ navigate, href }">
                <a @click="navigate" :href="href">
                    <i class="bx bx-arrow-to-right"></i> Head Injury Severe
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
						<li> <a href="pdxnull.php"><i class="bx bx-arrow-to-right"></i>ยังไม่มีวินิจฉัย</a>
						</li>
						<li> <a href="regis_dm.php"><i class="bx bx-arrow-to-right"></i>ลงทะเบียน DM</a>
						</li>
						<li> <a href="regis_ht.php"><i class="bx bx-arrow-to-right"></i>ลงทะเบียน HT</a>
						</li>
						<li> <a href="regis_ckd.php"><i class="bx bx-arrow-to-right"></i>ลงทะเบียน CKD </a>
						</li>
						<li> <a href="regis_asthma.php"><i class="bx bx-arrow-to-right"></i>ลงทะเบียน Asthma</a>
						</li>
						<li> <a href="regis_copd.php"><i class="bx bx-arrow-to-right"></i>ลงทะเบียน COPD</a>
						</li>
						<li> <a href="new_dm.php"><i class="bx bx-arrow-to-right"></i>วินิจฉัย DM รายใหม่</a>
						</li>
						<li> <a href="new_ht.php"><i class="bx bx-arrow-to-right"></i>วินิจฉัย HT รายใหม่</a>
						</li>
						<li> <a href="new_copd.php"><i class="bx bx-arrow-to-right"></i>วินิจฉัย COPD รายใหม่</a>
						</li>
						<li> <a href="new_asthma.php"><i class="bx bx-arrow-to-right"></i>วินิจฉัย Asthma รายใหม่</a>
						</li>
						<li> <a href="influ.php"><i class="bx bx-arrow-to-right"></i>ฉีดวัคซีน Influenza </a>
						</li>
						<li> <a href="nulllot.php"><i class="bx bx-arrow-to-right"></i>ไม่ลง Lot Influenza</a>
						</li>
						<li> <a href="eyedm.php"><i class="bx bx-arrow-to-right"></i>คัดกรองตา DM</a>
						</li>
						<li> <a href="footdm.php"><i class="bx bx-arrow-to-right"></i>คัดกรองเท้า DM</a>
						</li>
						<li> <a href="hba1c.php"><i class="bx bx-arrow-to-right"></i> HbA1C 90 วัน</a>
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
						<li> <a href="newborn.php"><i class="bx bx-arrow-to-right"></i>ทะเบียนเด็กอายุ 0-5 ปี</a>
						</li>
						<li> <a href="child.php"><i class="bx bx-arrow-to-right"></i>ทะเบียนเด็กอายุ 6-14 ปี</a>
						</li>
						<li> <a href="teen.php"><i class="bx bx-arrow-to-right"></i>ทะเบียนอายุ 15-21 ปี</a>
						</li>
						<li> <a href="adult.php"><i class="bx bx-arrow-to-right"></i>ทะเบียนอายุ 22-59 ปี</a>
						</li>
						<li> <a href="elderly.php"><i class="bx bx-arrow-to-right"></i>ทะเบียนอายุ 60 ปี</a>
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
						<li> <a href="pdxnuller.php"><i class="bx bx-arrow-to-right"></i>ยังไม่มีวินิจฉัย</a>
						</li>
						<li> <a href="headin.php"><i class="bx bx-arrow-to-right"></i>Head Injury ER</a>
						</li>
						<li> <a href="emergency.php"><i class="bx bx-arrow-to-right"></i>อุบัติเหตุจราจร </a>
						</li>
						<li> <a href="tube.php"><i class="bx bx-arrow-to-right"></i>ใส่ ET Tube </a>
						</li>
						<li> <a href="tube.php"><i class="bx bx-arrow-to-right"></i>หัตถการ CPR </a>
						</li>
						<li> <a href="tube.php"><i class="bx bx-arrow-to-right"></i>หัตถการ เข้าเฝือก </a>
						</li>
						<li> <a href="tube.php"><i class="bx bx-arrow-to-right"></i>หัตถการ ฉีดยา ER </a>
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
						<li> <a href="topipd.php"><i class="bx bx-arrow-to-right"></i>10 อันดับโรค IPD</a>
						</li>
						<li> <a href="admit.php"><i class="bx bx-arrow-to-right"></i> จำนวน Admit รวม</a>
						</li>
						<li> <a href="readmit.php"><i class="bx bx-arrow-to-right"></i>Re-Admit รวม</a>
						</li>
						<li> <a href="readmitold.php"><i class="bx bx-arrow-to-right"></i>Re-Admit-โรคเดิม </a>
						</li>
						<li> <a href="admitdm.php"><i class="bx bx-arrow-to-right"></i>Admit DM </a>
						</li>
						<li> <a href="readmitdm.php"><i class="bx bx-arrow-to-right"></i>Re-Admit DM </a>
						</li>
						<li> <a href="admitdmhypo.php"><i class="bx bx-arrow-to-right"></i>Admit DM + Hypogly</a>
						</li>
						<li> <a href="admitdmhyper.php"><i class="bx bx-arrow-to-right"></i>Admit DM + Hypergly</a>
						</li>
						<li> <a href="admitdhf.php"><i class="bx bx-arrow-to-right"></i>Admit DHF </a>
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
						<li> <a href="pychi.php"><i class="bx bx-arrow-to-right"></i>จำนวนผู้รับบริการ</a>
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
						<li> <a href="ptype2.php"><i class="bx bx-arrow-to-right"></i>แยกรายสิทธิ</a>
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
  