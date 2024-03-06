function getDashboardUrl(role) {
    console.log("getDashboardUrl called with at utiljs role:", role); // Add this line
    let dashboardUrl;
    switch (role) {
        case 'admin':
            dashboardUrl = '/admin/adminDashboard';
            break;
        case 'customer':
            dashboardUrl = '/customer/dashboard';
            break;
        default:
            dashboardUrl = '/';
    }
    console.log("utilsjs redirecting to:", dashboardUrl);
    return dashboardUrl;
}

module.exports = {
    getDashboardUrl
};
