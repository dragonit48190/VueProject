<template>
    <!--start page wrapper -->
    <div class="page-wrapper">
                <div class="page-content">
                    <!--Start Row Card Authen -->
                    <div class="row">
                        <div class="col-xl-2 col-md-6 mb-4">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="mb-0 text-danger" >ยังไม่ขอ AUTHEN</p>
                                            <h4 class="font-weight-bold text-danger">
                                                {{ notauthen !== null ? notauthen + ' ครั้ง' : 'กำลังโหลด...' }}
                                            </h4>
                                            <p class="text-secondary mb-0 font-13">ประมวลผลเวลาปัจจุบัน </p>
                                        </div>
                                        <div class="widgets-icons bg-gradient-burning text-white"><i class='bx bx-user-minus'></i>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-2 col-md-6 mb-4">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="mb-0 text-success">ขอ AUTHEN แล้ว</p>
                                            <h4 class="font-weight-bold text-success">
                                                {{ authened !== null ? authened + ' ครั้ง' : 'กำลังโหลด...' }}
                                            </h4>
                                            <p class="text-secondary mb-0 font-13">ประมวลผลเวลาปัจจุบัน </p>
                                        </div>
                                        <div class="widgets-icons bg-gradient-lush text-white"><i class='bx bx-user-check'></i>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-2 col-md-6 mb-4">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="mb-0 text-info">จำนวนผู้รับบริการวันนี้ </p>
                                            <h4 class="font-weight-bold text-info">{{ authenTotal ?? 'กำลังโหลด...' }} ครั้ง </h4>
                                            <p class="text-secondary mb-0 font-13">จำนวนผู้รับบริการรวม</p>
                                        </div>
                                        <div class="widgets-icons bg-info text-white"><i class='bx bx-group'></i>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-2 col-md-6 mb-4">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="mb-0 text-warning">จำนวนผู้ป่วย OPD</p>
                                            <h4 class="font-weight-bold text-warning">
                                                {{ opd !== null ? opd + ' ครั้ง' : 'กำลังโหลด...' }}
                                            </h4>
                                            <p class="text-secondary mb-0 font-13">นับเฉพาะแผนก OPD </p>
                                        </div>
                                        <div class="widgets-icons bg-gradient-kyoto text-white"><i class='bx bxs-group'></i>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-2 col-md-6 mb-4">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="mb-0 text-primary">แผนกทันตกรรม</p>
                                            <h4 class="font-weight-bold text-primary">
                                                {{ dent !== null ? dent + ' ครั้ง' : 'กำลังโหลด...' }} 
                                            </h4>
                                            <p class="text-secondary mb-0 font-13">แผนกทันตกรรม</p>
                                        </div>
                                        <div class="widgets-icons bg-primary text-white"><i class='bx bxs-user-x'></i>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-2 col-md-6 mb-4">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <p class="mb-0 text-danger">จำนวนผู้ป่วย ER </p>
                                            <h4 class="font-weight-bold text-danger">
                                                {{ er !== null ? er + ' ครั้ง' :'กำลังโหลด...' }}
                                            </h4>
                                            <p class="text-secondary mb-0 font-13">จำนวนแผนก ER </p>
                                        </div>
                                        <div class="widgets-icons bg-danger text-white"><i class='bx bxs-user-plus'></i>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--End Row Card Authen -->
    
                    <!-- 🔥 ใช้ OpdChart Component แทน HTML เดิม -->
                    <OpdChart />

                    <!-- 🔥 เพิ่ม WardCards Component -->
                    <WardCards />
    
                    <!-- 🔥 เพิ่ม PatientIpdChart Component -->
                    <PatientIpdChart />
    
                    <!-- 🔥 เพิ่ม IpdChart Component -->
                    <IpdChart />
    
                    
                    <div class="row row-cols-1 row-cols-lg-3">
                        <div class="col">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div id="chart4"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div id="chart5"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card radius-10">
                                <div class="card-body">
                                    <div id="chart6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
            <!--end page wrapper -->
    
    </template>
    
    <script>
    // 🔥 Import Components
    import OpdChart from '@/components/OpdChart.vue'
    import IpdChart from '@/components/IpdChart.vue'
    import PatientIpdChart from '@/components/PatientIpdChart.vue'
    import WardCards from '@/components/WardCards.vue'
    
    export default {
      name: "AppMain",
      // 🔥 เพิ่ม components
      components: {
        OpdChart,
        IpdChart,
        PatientIpdChart,
        WardCards
      },
      props: {
        authenTotal: Number,
        notauthen: Number,
        authened: Number,
        opd: Number,
        dent: Number,
        er: Number     
      }
    }
    </script>