/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package demo.happiness;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import twitter4j.Paging;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.User;
/**
 *
 * @author Ben
 */
@WebServlet(name = "AnalysisLogic", urlPatterns = {"/AnalysisLogic"})
public class AnalysisLogic extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("user");
        Twitter t = (new TwitterFactory()).getInstance();
        SentimentAnalyzer sa = new SentimentAnalyzer();
        sa.setUserName(username); // username 
        try{sa.start();}catch(TwitterException e){
          RequestDispatcher rd = request.getRequestDispatcher("./index.jsp?msg=usernotfound");
        rd.forward(request, response);        
        }
        Map<Date, Integer> dailyScore = sa.getDailyScore();
        String userurl = sa.getImageUrl();
        
        HttpSession session = request.getSession();
        session.setAttribute("dailyScore", dailyScore);
        session.setAttribute("userUrl", userurl);
        
        RequestDispatcher rd = request.getRequestDispatcher("./display.jsp");
        rd.forward(request, response);        
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
        /*try {
            processRequest(request, response);
        } catch (TwitterException ex) {
            Logger.getLogger(AnalysisLogic.class.getName()).log(Level.SEVERE, null, ex);
        }*/
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
       processRequest(request, response);
        /* try {
            processRequest(request, response);
        } catch (TwitterException ex) {
            Logger.getLogger(AnalysisLogic.class.getName()).log(Level.SEVERE, null, ex);
        }*/
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
