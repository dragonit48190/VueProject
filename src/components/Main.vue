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
                <div class="row">
                    <div class="col-12 col-lg-8 d-lg-flex align-items-lg-stretch">
                        <div class="card radius-10 w-100">
                            <div class="card-header border-bottom-0 bg-transparent">
                                <div class="d-lg-flex align-items-center">
                                    <div class="">
                                        <h5 class="mb-1 text-primary">สรุปยอดผู้ป่วยนอก ปีงบ 2568 โรงพยาบาลโพนสวรรค์</h5>
                                        <p class="text-secondary mb-2 mb-lg-0 font-14">ผู้ป่วยนอกแยกรายเดือน ปีงบ 2568 </p>
                                    </div>
                                    <div class="ms-lg-auto">
                                        <div class="btn-group-round">
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-white">Day</button>
                                                <button type="button" class="btn btn-white">Week</button>
                                                <button type="button" class="btn btn-white">Month</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <div id="chart3"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4 d-lg-flex align-items-lg-stretch">
                        <div class="card radius-10 w-100">
                            <div class="card-header bg-transparent">แยกรายแพทย์</div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-striped mb-0">
                                        <thead>
                                            <tr>
                                                <th>แพทย์</th>
                                                <th>Visit</th>
                                                <th>Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>นพ.พันกร</td>
                                                <td>56</td>
                                                <td>10%</td>
                                            </tr>
                                            <tr>
                                                <td>นพ.สิทธิพงษ์</td>
                                                <td>29</td>
                                                <td>12%</td>
                                            </tr>
                                            <tr>
                                                <td>นพ.ณัฐ</td>
                                                <td>68</td>
                                                <td>33%</td>
                                            </tr>
                                            <tr>
                                                <td>พญ.เกษ</td>
                                                <td>14</td>
                                                <td>24%</td>
                                            </tr>
                                            <tr>
                                                <td>พญ.มณี</td>
                                                <td>87</td>
                                                <td>22%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--end row-->
                
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
<!-- Insert prop AppMain -->
<script>
export default {
  name: "AppMain",
  props: {
    authenTotal: Number,
    notauthen: Number,
    authened: Number,
    opd:Number,
    dent:Number,
    er:Number     
  }
}
</script>